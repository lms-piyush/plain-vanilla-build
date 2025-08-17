import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-ENHANCED-ENROLLMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Session ID is required");
    logStep("Request data parsed", { sessionId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Stripe session retrieved", { 
      sessionId: session.id, 
      paymentStatus: session.payment_status,
      mode: session.mode 
    });

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    // Get our session record
    const { data: sessionRecord, error: sessionError } = await supabaseService
      .from('subscription_sessions')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single();

    if (sessionError) {
      logStep("Session record not found", { error: sessionError });
      throw new Error("Session record not found");
    }

    logStep("Session record found", { sessionRecord });

    // Check if already processed
    if (sessionRecord.status === 'completed') {
      logStep("Session already processed");
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Already processed",
        enrolled: true 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    let enrollmentType = 'one_time';
    let subscriptionId = null;

    // Handle subscription vs payment enrollment
    if (sessionRecord.session_type === 'subscription') {
      // For subscriptions, get the subscription ID
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        subscriptionId = subscription.id;
        enrollmentType = 'subscription';
        logStep("Subscription created", { subscriptionId });
      }
    }

    // Get class details for batch number
    const { data: classData, error: classError } = await supabaseService
      .from('classes')
      .select('batch_number, title')
      .eq('id', sessionRecord.class_id)
      .single();

    if (classError) {
      logStep("Class not found", { error: classError });
      throw new Error("Class not found");
    }

    // Create student enrollment
    const { error: enrollmentError } = await supabaseService
      .from('student_enrollments')
      .insert({
        student_id: sessionRecord.user_id,
        class_id: sessionRecord.class_id,
        batch_number: classData.batch_number,
        enrollment_type: enrollmentType,
        subscription_id: subscriptionId,
        payment_status: 'paid',
        status: 'active'
      });

    if (enrollmentError) {
      logStep("Enrollment creation failed", { error: enrollmentError });
      throw new Error(`Enrollment failed: ${enrollmentError.message}`);
    }

    // Update session status
    await supabaseService
      .from('subscription_sessions')
      .update({ status: 'completed' })
      .eq('id', sessionRecord.id);

    // Update payment_enrollments if exists (backward compatibility)
    if (sessionRecord.session_type === 'payment') {
      await supabaseService
        .from('payment_enrollments')
        .update({ enrollment_completed: true, status: 'completed' })
        .eq('stripe_session_id', sessionId);

      // Update orders table
      await supabaseService
        .from('orders')
        .update({ status: 'paid' })
        .eq('stripe_session_id', sessionId);
    }

    // Create notification for the student
    await supabaseService
      .from('notifications')
      .insert({
        user_id: sessionRecord.user_id,
        title: 'Enrollment Successful',
        description: `You have been successfully enrolled in "${classData.title}".`,
        notification_type: 'enrollment_success'
      });

    // Get tutor details to notify them
    const { data: tutorData } = await supabaseService
      .from('classes')
      .select(`
        tutor_id,
        profiles!classes_tutor_id_fkey (full_name)
      `)
      .eq('id', sessionRecord.class_id)
      .single();

    if (tutorData?.tutor_id) {
      const { data: studentProfile } = await supabaseService
        .from('profiles')
        .select('full_name')
        .eq('id', sessionRecord.user_id)
        .single();

      // Notify tutor
      await supabaseService
        .from('notifications')
        .insert({
          user_id: tutorData.tutor_id,
          title: 'New Student Enrollment',
          description: `${studentProfile?.full_name || 'A student'} has enrolled in "${classData.title}".`,
          notification_type: 'new_enrollment',
          reference_id: sessionRecord.class_id,
          reference_table: 'classes'
        });
    }

    logStep("Enrollment completed successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      enrolled: true,
      enrollmentType,
      subscriptionId 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in process-enhanced-enrollment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});