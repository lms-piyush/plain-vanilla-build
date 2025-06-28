
import { supabase } from "@/integrations/supabase/client";

export const fetchClassEnrollments = async (classId: string) => {
  const { data: enrollments, error } = await supabase
    .from('student_enrollments')
    .select('*')
    .eq('class_id', classId);

  if (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }

  // Fetch profiles separately for each enrollment
  const enrichedEnrollments = await Promise.all(
    (enrollments || []).map(async (enrollment) => {
      // Try to get the profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, id')
        .eq('id', enrollment.student_id)
        .single();

      if (!profileError && profile) {
        return {
          ...enrollment,
          profiles: profile
        };
      } else {
        // Fallback to using student_id as display name
        return {
          ...enrollment,
          profiles: {
            id: enrollment.student_id,
            full_name: `Student ${enrollment.student_id.slice(-4)}`, // Use last 4 chars of ID
          }
        };
      }
    })
  );

  return enrichedEnrollments;
};
