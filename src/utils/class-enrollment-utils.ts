
import { supabase } from "@/integrations/supabase/client";

export const fetchClassEnrollments = async (classId: string, batchNumber?: number) => {
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

  // Filter by specific batch if provided
  if (batchNumber !== undefined) {
    query = query.eq('batch_number', batchNumber);
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

export const fetchAllBatchNumbers = async (classId: string) => {
  const { data, error } = await supabase
    .from('student_enrollments')
    .select('batch_number')
    .eq('class_id', classId)
    .order('batch_number', { ascending: false });

  if (error) {
    console.error('Error fetching batch numbers:', error);
    throw error;
  }

  // Get unique batch numbers
  const uniqueBatches = [...new Set(data?.map(item => item.batch_number) || [])];
  return uniqueBatches;
};
