import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    logStep("User authenticated", { userId: user.id, email: user.email });

    const { priceAmount, priceTier, isSubscription, customerInfo } = await req.json();
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists or create new one with billing address
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
      
      // Update customer with billing address if provided
      if (customerInfo?.address) {
        await stripe.customers.update(customerId, {
          name: customerInfo.name || user.email,
          address: customerInfo.address
        });
        logStep("Updated customer with billing address");
      }
    } else {
      // Create new customer with required information
      const customer = await stripe.customers.create({
        email: user.email,
        name: customerInfo?.name || user.email,
        ...(customerInfo?.address && { address: customerInfo.address })
      });
      customerId = customer.id;
      logStep("Created new customer with billing address", { customerId });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      billing_address_collection: 'required',
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { 
              name: isSubscription ? `${priceTier} Subscription` : "Course Purchase"
            },
            unit_amount: priceAmount, // Amount in paisa (INR cents)
            ...(isSubscription && { recurring: { interval: "month" } })
          },
          quantity: 1,
        },
      ],
      mode: isSubscription ? "subscription" : "payment",
      success_url: `${req.headers.get("origin")}/student?payment=success`,
      cancel_url: `${req.headers.get("origin")}/student?payment=cancelled`,
    });

    logStep("Checkout session created", { sessionId: session.id, mode: isSubscription ? "subscription" : "payment" });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    
    // Handle specific Stripe configuration errors
    let userFriendlyMessage = errorMessage;
    if (errorMessage.includes("account or business name")) {
      userFriendlyMessage = "Stripe account setup incomplete. Please configure your business details in Stripe Dashboard.";
    } else if (errorMessage.includes("No such price")) {
      userFriendlyMessage = "Invalid price configuration. Please check your Stripe price settings.";
    } else if (errorMessage.includes("Invalid currency")) {
      userFriendlyMessage = "Currency not supported. Please enable INR in your Stripe account.";
    }
    
    return new Response(JSON.stringify({ 
      error: userFriendlyMessage,
      details: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});