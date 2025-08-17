import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CLASS-SUBSCRIPTION-CHECKOUT] ${step}${detailsStr}`);
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

    const { classId, monthlyAmount, className, currency = "inr" } = await req.json();
    if (!classId || !monthlyAmount || !className) {
      throw new Error("classId, monthlyAmount, and className are required");
    }
    logStep("Request data parsed", { classId, monthlyAmount, className, currency });

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

    // Create a dynamic price for this specific class subscription
    const product = await stripe.products.create({
      name: `${className} - Monthly Subscription`,
      description: `Monthly subscription for class: ${className}`,
      metadata: {
        class_id: classId,
        user_id: user.id,
        type: 'class_subscription'
      }
    });
    logStep("Product created", { productId: product.id });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: monthlyAmount,
      currency: currency.toLowerCase(),
      recurring: {
        interval: "month",
      },
      metadata: {
        class_id: classId,
        user_id: user.id,
        type: 'class_subscription'
      }
    });
    logStep("Price created", { priceId: price.id, amount: monthlyAmount });

    // Use service role to save session info
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/student/subscription-success?session_id={CHECKOUT_SESSION_ID}&class_id=${classId}`,
      cancel_url: `${origin}/student/classes/${classId}`,
      metadata: {
        user_id: user.id,
        class_id: classId,
        monthly_amount: monthlyAmount.toString(),
        class_name: className,
        type: 'class_subscription'
      },
    });

    // Save session to database
    await supabaseService.from('subscription_sessions').insert({
      user_id: user.id,
      class_id: classId,
      stripe_session_id: session.id,
      calculated_amount: monthlyAmount,
      base_amount: monthlyAmount,
      class_count: 1,
      session_type: 'class_subscription',
      status: 'pending',
      metadata: {
        class_name: className,
        currency: currency,
        price_id: price.id,
        product_id: product.id,
      }
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-class-subscription-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});