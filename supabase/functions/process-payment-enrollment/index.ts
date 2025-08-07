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

  const supabaseService = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Session ID is required");

    logStep("Processing payment enrollment", { sessionId });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Retrieved Stripe session", { sessionId, status: session.payment_status });

    if (session.payment_status !== 'paid') {
      throw new Error(`Payment not completed. Status: ${session.payment_status}`);
    }

    // Find payment enrollment record
    const { data: paymentEnrollment, error: fetchError } = await supabaseService
      .from("payment_enrollments")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .single();

    if (fetchError) {
      logStep("Error fetching payment enrollment", { error: fetchError });
      throw new Error("Payment enrollment record not found");
    }

    if (paymentEnrollment.enrollment_completed) {
      logStep("Enrollment already completed", { paymentEnrollmentId: paymentEnrollment.id });
      return new Response(JSON.stringify({ success: true, message: "Already enrolled" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Found payment enrollment", { paymentEnrollment });

    // Get class data
    const { data: classData, error: classError } = await supabaseService
      .from("classes")
      .select("title, tutor_id, batch_number")
      .eq("id", paymentEnrollment.class_id)
      .single();

    if (classError) {
      logStep("Error fetching class data", { error: classError });
      throw new Error("Class not found");
    }

    // Create enrollment
    const enrollmentTimestamp = new Date().toISOString();
    const { error: enrollmentError } = await supabaseService
      .from("student_enrollments")
      .insert({
        class_id: paymentEnrollment.class_id,
        student_id: paymentEnrollment.user_id,
        batch_number: classData.batch_number,
        status: "active",
        payment_status: "paid",
        enrollment_date: enrollmentTimestamp,
      });

    if (enrollmentError) {
      logStep("Error creating enrollment", { error: enrollmentError });
      throw new Error("Failed to create enrollment");
    }

    logStep("Enrollment created successfully");

    // Mark payment enrollment as completed
    await supabaseService
      .from("payment_enrollments")
      .update({ 
        status: "completed", 
        enrollment_completed: true,
        updated_at: enrollmentTimestamp
      })
      .eq("id", paymentEnrollment.id);

    // Update order status
    await supabaseService
      .from("orders")
      .update({ status: "paid" })
      .eq("stripe_session_id", sessionId);

    // Send notifications
    try {
      const { data: studentData } = await supabaseService
        .from("profiles")
        .select("full_name")
        .eq("id", paymentEnrollment.user_id)
        .single();

      const { data: tutorData } = await supabaseService
        .from("profiles")
        .select("full_name")
        .eq("id", classData.tutor_id)
        .single();

      if (studentData) {
        // Notify tutor about enrollment
        await supabaseService.from("notifications").insert({
          user_id: classData.tutor_id,
          title: "New Student Enrollment",
          description: `${studentData.full_name} has enrolled in ${classData.title}`,
          notification_type: "student_enrollment",
          reference_id: paymentEnrollment.class_id,
          reference_table: "classes",
          sender_id: paymentEnrollment.user_id,
        });

        // Notify student about successful enrollment
        if (tutorData) {
          await supabaseService.from("notifications").insert({
            user_id: paymentEnrollment.user_id,
            title: "Enrollment Successful",
            description: `You have successfully enrolled in ${classData.title} with ${tutorData.full_name}`,
            notification_type: "enrollment_success",
            reference_id: paymentEnrollment.class_id,
            reference_table: "classes",
            sender_id: classData.tutor_id,
          });
        }
      }

      logStep("Notifications sent successfully");
    } catch (notificationError) {
      logStep("Failed to send notifications", { error: notificationError });
    }

    logStep("Payment enrollment process completed successfully");

    return new Response(JSON.stringify({ success: true, enrolled: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in process-payment-enrollment", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});