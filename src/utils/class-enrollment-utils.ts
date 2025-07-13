
import { supabase } from "@/integrations/supabase/client";

export const fetchClassEnrollments = async (classId: string, filterByLatestBatch: boolean = true) => {
  // First get the class to find the current batch number
  const { data: classData, error: classError } = await supabase
    .from('classes')
    .select('batch_number')
    .eq('id', classId)
    .single();

  if (classError) {
    console.error('Error fetching class data:', classError);
    throw classError;
  }

  let query = supabase
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

  // Filter by latest batch if requested
  if (filterByLatestBatch && classData) {
    query = query.eq('batch_number', classData.batch_number);
  }

  const { data: enrollments, error } = await query;

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
