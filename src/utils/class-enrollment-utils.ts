
import { supabase } from "@/integrations/supabase/client";

export const fetchClassEnrollments = async (classId: string) => {
  const { data: enrollments, error } = await supabase
    .from('student_enrollments')
    .select(`
      *,
      profiles!student_enrollments_student_id_fkey (
        full_name,
        id
      )
    `)
    .eq('class_id', classId);

  if (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }

  // For students without profiles, we need to fetch their email from auth
  const enrichedEnrollments = await Promise.all(
    (enrollments || []).map(async (enrollment) => {
      if (!enrollment.profiles?.full_name) {
        try {
          // Try to get user email as fallback
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(enrollment.student_id);
          if (!userError && userData.user?.email) {
            return {
              ...enrollment,
              profiles: {
                ...enrollment.profiles,
                email: userData.user.email,
                full_name: enrollment.profiles?.full_name || null
              }
            };
          }
        } catch (emailError) {
          console.error('Error fetching user email:', emailError);
        }
      }
      return enrollment;
    })
  );

  return enrichedEnrollments;
};
