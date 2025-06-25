
import { supabase } from "@/integrations/supabase/client";

export const fetchClassEnrollments = async (classId: string) => {
  const { data: enrollmentsData, error: enrollmentsError } = await supabase
    .from("student_enrollments")
    .select(`
      id,
      student_id,
      enrollment_date,
      status,
      payment_status
    `)
    .eq("class_id", classId);

  if (enrollmentsError) {
    console.error("Error fetching enrollments:", enrollmentsError);
    return [];
  }

  if (!enrollmentsData) return [];

  // Fetch profile data and email for each enrolled student
  const enrolledStudents = [];
  for (const enrollment of enrollmentsData) {
    // Fetch profile data
    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", enrollment.student_id)
      .single();

    // Create a placeholder email based on the student_id
    const email = `student-${enrollment.student_id.slice(-8)}@example.com`;

    enrolledStudents.push({
      ...enrollment,
      profiles: profileData ? {
        ...profileData,
        email: email
      } : {
        full_name: `Student ${enrollment.student_id.slice(-4)}`,
        role: 'student',
        email: email
      }
    });
  }

  return enrolledStudents;
};
