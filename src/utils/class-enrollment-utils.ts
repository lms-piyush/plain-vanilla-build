
import { supabase } from "@/integrations/supabase/client";

export const fetchClassEnrollments = async (classId: string) => {
  const { data: enrollments, error } = await supabase
    .from('student_enrollments')
    .select(`
      *,
      profiles:student_id (
        full_name,
        role,
        id
      )
    `)
    .eq('class_id', classId);

  if (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }

  // Process enrollments and handle missing profile data
  const enrichedEnrollments = (enrollments || []).map((enrollment) => {
    if (enrollment.profiles && typeof enrollment.profiles === 'object') {
      return {
        ...enrollment,
        profiles: {
          full_name: enrollment.profiles.full_name || `Student ${enrollment.student_id.slice(-4)}`,
          role: enrollment.profiles.role || 'student',
          id: enrollment.profiles.id
        }
      };
    } else {
      // Fallback when profile is not found
      return {
        ...enrollment,
        profiles: {
          id: enrollment.student_id,
          full_name: `Student ${enrollment.student_id.slice(-4)}`,
          role: 'student'
        }
      };
    }
  });

  return enrichedEnrollments;
};
