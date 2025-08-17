import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-SUBSCRIPTION-SUCCESS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    // Use service role key for database writes
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { sessionId, classId } = await req.json();
    if (!sessionId) throw new Error("Session ID is required");
    logStep("Request data parsed", { sessionId, classId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      throw new Error('Payment not completed');
    }
    logStep("Session verified", { paymentStatus: session.payment_status });

    const userId = session.metadata?.user_id;
    if (!userId) throw new Error("User ID not found in session metadata");

    // Get subscription details
    const subscriptionId = session.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0].price.id;
    const currentPeriodStart = new Date(subscription.current_period_start * 1000);
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    
    logStep("Subscription details retrieved", { 
      subscriptionId, 
      priceId, 
      currentPeriodStart, 
      currentPeriodEnd 
    });

    // Get subscription plan details
    const { data: planData, error: planError } = await supabaseService
      .from("subscription_plans")
      .select("*")
      .eq("stripe_price_id", priceId)
      .single();

    if (planError) {
      logStep("Plan not found, using default tier", { priceId });
    }

    const subscriptionTier = planData?.name.toLowerCase() || 'basic';

    // Update subscribers table
    const { error: subscriberError } = await supabaseService
      .from("subscribers")
      .upsert({
        user_id: userId,
        email: session.customer_details?.email || '',
        stripe_customer_id: session.customer as string,
        subscribed: true,
        subscription_tier: subscriptionTier,
        subscription_status: subscription.status,
        subscription_id: subscriptionId,
        subscription_price_id: priceId,
        subscription_end: currentPeriodEnd.toISOString(),
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (subscriberError) {
      logStep("Error updating subscriber", { error: subscriberError });
      throw subscriberError;
    }

    // Add subscription history record
    const { error: historyError } = await supabaseService
      .from("subscription_history")
      .insert({
        user_id: userId,
        subscription_id: subscriptionId,
        amount: subscription.items.data[0].price.unit_amount || 0,
        currency: subscription.currency,
        status: 'paid',
        billing_period_start: currentPeriodStart.toISOString(),
        billing_period_end: currentPeriodEnd.toISOString(),
        paid_at: new Date().toISOString(),
      });

    if (historyError) {
      logStep("Error adding subscription history", { error: historyError });
    }

    // If classId is provided, create enrollment
    if (classId) {
      const { error: enrollmentError } = await supabaseService
        .from("student_enrollments")
        .insert({
          student_id: userId,
          class_id: classId,
          enrollment_type: 'subscription',
          subscription_id: subscriptionId,
          status: 'active',
          payment_status: 'paid',
        });

      if (enrollmentError) {
        logStep("Error creating enrollment", { error: enrollmentError });
      } else {
        logStep("Enrollment created successfully");
      }
    }

    logStep("Subscription processing completed successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      subscriptionTier,
      subscriptionEnd: currentPeriodEnd.toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in process-subscription-success", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});