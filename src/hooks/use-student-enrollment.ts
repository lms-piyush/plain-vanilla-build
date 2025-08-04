
import { supabase } from "@/integrations/supabase/client";
import { notificationService } from "@/services/notification-service";

export const enrollStudentInClass = async (classId: string, studentId: string) => {
  try {
    console.log("Starting enrollment process for:", { classId, studentId });
    
    // Get class data first
    const { data: classData } = await supabase
      .from("classes")
      .select("title, tutor_id, batch_number")
      .eq("id", classId)
      .single();

    console.log("Class data retrieved:", classData);

    if (!classData) throw new Error("Class not found");

    // Create enrollment with current timestamp
    const enrollmentTimestamp = new Date().toISOString();
    const { error } = await supabase
      .from("student_enrollments")
      .insert({
        class_id: classId,
        student_id: studentId,
        batch_number: classData.batch_number,
        status: "active",
        payment_status: "paid",
        enrollment_date: enrollmentTimestamp,
      });

    if (error) {
      console.error("Enrollment insertion error:", error);
      throw error;
    }

    console.log("Enrollment created successfully, sending notification...");

    // Send notifications
    try {
      const { data: studentData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", studentId)
        .single();

      const { data: tutorData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", classData.tutor_id)
        .single();

      console.log("Student data for notification:", studentData);
      console.log("Tutor data for notification:", tutorData);

      if (studentData) {
        // Notify tutor about enrollment
        console.log("Calling tutor notification service with:", {
          classId,
          tutorId: classData.tutor_id,
          studentName: studentData.full_name,
          classTitle: classData.title,
          timestamp: enrollmentTimestamp
        });

        await notificationService.notifyStudentEnrollment(
          classId,
          classData.tutor_id,
          studentData.full_name,
          classData.title,
          enrollmentTimestamp
        );
        
        console.log("Tutor notification sent successfully");

        // Notify student about successful enrollment
        if (tutorData) {
          console.log("Calling student notification service with:", {
            classId,
            studentId,
            className: classData.title,
            tutorName: tutorData.full_name
          });

          await notificationService.notifyStudentEnrollmentSuccess(
            classId,
            studentId,
            classData.title,
            tutorData.full_name
          );
          
          console.log("Student notification sent successfully");
        }
      } else {
        console.warn("No student data found for notification");
      }
    } catch (notificationError) {
      console.error("Failed to send enrollment notifications:", notificationError);
    }
  } catch (error) {
    console.error("Error enrolling student:", error);
    throw error;
  }
};
