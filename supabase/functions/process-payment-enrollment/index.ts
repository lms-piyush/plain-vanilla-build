import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-PAYMENT-ENROLLMENT] ${step}${detailsStr}`);
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

    logStep("Processing session", { sessionId });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Retrieved Stripe session", { 
      id: session.id, 
      paymentStatus: session.payment_status,
      customerId: session.customer 
    });

    if (session.payment_status !== 'paid') {
      throw new Error(`Payment not completed. Status: ${session.payment_status}`);
    }

    // Initialize Supabase with service role key for admin operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get payment enrollment record
    const { data: paymentEnrollment, error: enrollmentError } = await supabaseService
      .from("payment_enrollments")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .single();

    if (enrollmentError || !paymentEnrollment) {
      logStep("Payment enrollment not found", { sessionId, error: enrollmentError });
      throw new Error("Payment enrollment record not found");
    }

    if (paymentEnrollment.enrollment_completed) {
      logStep("Enrollment already completed", { sessionId });
      return new Response(JSON.stringify({ 
        success: true, 
        enrolled: true,
        message: "Enrollment already completed",
        enrollment_id: paymentEnrollment.id 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get class details to determine batch number
    const { data: classData, error: classError } = await supabaseService
      .from("classes")
      .select("batch_number")
      .eq("id", paymentEnrollment.class_id)
      .single();

    if (classError || !classData) {
      throw new Error(`Class not found: ${classError?.message}`);
    }

    // Create student enrollment
    const { data: enrollment, error: enrollmentCreateError } = await supabaseService
      .from("student_enrollments")
      .insert({
        student_id: paymentEnrollment.user_id,
        class_id: paymentEnrollment.class_id,
        batch_number: classData.batch_number,
        enrollment_date: new Date().toISOString(),
        payment_status: "paid",
        status: "active"
      })
      .select()
      .single();

    if (enrollmentCreateError) {
      logStep("Failed to create enrollment", { error: enrollmentCreateError });
      throw new Error(`Failed to create enrollment: ${enrollmentCreateError.message}`);
    }

    // Update payment enrollment as completed
    await supabaseService
      .from("payment_enrollments")
      .update({ 
        enrollment_completed: true,
        status: "completed",
        updated_at: new Date().toISOString()
      })
      .eq("id", paymentEnrollment.id);

    // Update order status
    await supabaseService
      .from("orders")
      .update({ 
        status: "paid",
        updated_at: new Date().toISOString()
      })
      .eq("stripe_session_id", sessionId);

    logStep("Enrollment completed successfully", { 
      enrollmentId: enrollment.id,
      classId: paymentEnrollment.class_id,
      studentId: paymentEnrollment.user_id 
    });

    return new Response(JSON.stringify({ 
      success: true, 
      enrolled: true,
      enrollment_id: enrollment.id,
      message: "Enrollment completed successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in process-payment-enrollment", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false,
      enrolled: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});