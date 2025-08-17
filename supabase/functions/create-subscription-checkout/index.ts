import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-SUBSCRIPTION-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Use anon key for authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { priceId, classId, classCount = 1 } = await req.json();
    if (!priceId) throw new Error("Price ID is required");
    logStep("Request data parsed", { priceId, classId, classCount });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
      logStep("New customer created", { customerId });
    }

    // Resolve the provided identifier to a real Stripe price ID
    let resolvedPriceId: string | null = null;

    // Case 1: Already a real price id
    if (typeof priceId === 'string' && priceId.startsWith('price_')) {
      resolvedPriceId = priceId;
      logStep("Using provided price id", { priceId: resolvedPriceId });
    }

    // Case 2: A Stripe product id (use its default price or pick any recurring active price)
    if (!resolvedPriceId && typeof priceId === 'string' && priceId.startsWith('prod_')) {
      const product = await stripe.products.retrieve(priceId);
      const defaultPrice = product.default_price as (string | { id: string } | null);
      if (typeof defaultPrice === 'string') {
        resolvedPriceId = defaultPrice;
        logStep("Resolved price from product default_price (string)", { resolvedPriceId });
      } else if (defaultPrice && typeof defaultPrice === 'object' && 'id' in defaultPrice) {
        resolvedPriceId = defaultPrice.id;
        logStep("Resolved price from product default_price (object)", { resolvedPriceId });
      }
      if (!resolvedPriceId) {
        const pricesForProduct = await stripe.prices.list({ product: priceId, active: true, limit: 10 });
        const recurringPrice = pricesForProduct.data.find(p => p.recurring);
        const anyPrice = pricesForProduct.data[0];
        resolvedPriceId = (recurringPrice || anyPrice)?.id ?? null;
        logStep("Resolved price by listing product prices", { resolvedPriceId });
      }
    }

    // Case 3: Treat as a lookup_key (e.g. "price_basic_monthly")
    if (!resolvedPriceId && typeof priceId === 'string') {
      try {
        // Prefer search API when available
        // Example query: active:'true' AND lookup_key:'price_basic_monthly'
        // @ts-ignore - search may not be in all type defs for this env
        const searchResult = await stripe.prices.search({
          // Quote the lookup_key to avoid parsing issues
          query: `active:'true' AND lookup_key:'${priceId.replace(/'/g, "\\'")}'`,
          limit: 1,
        });
        if (searchResult?.data?.length) {
          resolvedPriceId = searchResult.data[0].id;
          logStep("Resolved price via search on lookup_key", { resolvedPriceId });
        }
      } catch (_err) {
        // Fallback: list and filter by lookup_key
        const list = await stripe.prices.list({ active: true, limit: 100 });
        const match = list.data.find(p => p.lookup_key === priceId);
        if (match) {
          resolvedPriceId = match.id;
          logStep("Resolved price via list+filter on lookup_key", { resolvedPriceId });
        }
      }
    }

    if (!resolvedPriceId) {
      throw new Error("Could not resolve a valid Stripe price from the provided identifier. Ensure the value is a Price ID, Product ID with default price, or a Price lookup_key.");
    }

    // Get price details - for subscriptions, use base amount only (no multiplication)
    const priceDetails = await stripe.prices.retrieve(resolvedPriceId);
    const baseAmount = priceDetails.unit_amount || 0;
    const calculatedAmount = baseAmount; // No multiplication for subscriptions
    
    logStep("Price calculation", { baseAmount, classCount, calculatedAmount });

    // Use service role to save session info
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Create checkout session for subscription with dynamic pricing
    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    // Use original price for subscriptions - no custom pricing needed
    let sessionPriceId = resolvedPriceId;
    
    // Ensure currency is INR for subscriptions
    if (priceDetails.currency !== 'inr') {
      logStep("Warning: Price currency is not INR", { currency: priceDetails.currency });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: sessionPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/student/subscription-success?session_id={CHECKOUT_SESSION_ID}&class_id=${classId || ''}`,
      cancel_url: `${origin}/student/classes/${classId || ''}`,
      metadata: {
        user_id: user.id,
        class_id: classId || '',
        class_count: classCount.toString(),
        base_amount: baseAmount.toString(),
        calculated_amount: calculatedAmount.toString(),
      },
    });

    // Save session to database
    await supabaseService.from('subscription_sessions').insert({
      user_id: user.id,
      class_id: classId || null,
      stripe_session_id: session.id,
      calculated_amount: calculatedAmount,
      base_amount: baseAmount,
      class_count: classCount,
      session_type: 'subscription',
      status: 'pending',
      metadata: {
        original_price_id: resolvedPriceId,
        custom_price_id: sessionPriceId !== resolvedPriceId ? sessionPriceId : null,
      }
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-subscription-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});