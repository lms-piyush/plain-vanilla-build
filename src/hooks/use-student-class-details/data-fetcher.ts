
import { supabase } from "@/integrations/supabase/client";

export const fetchClassData = async (classId: string) => {
  const { data: classData, error: classError } = await supabase
    .from("classes")
    .select(`
      *,
      class_locations!class_locations_class_id_fkey (
        meeting_link,
        street,
        city,
        state,
        zip_code,
        country
      ),
      class_time_slots!class_time_slots_class_id_fkey (
        id,
        day_of_week,
        start_time,
        end_time
      ),
      class_schedules!class_schedules_class_id_fkey (
        id,
        start_date,
        end_date,
        frequency,
        total_sessions
      ),
      class_syllabus!class_syllabus_class_id_fkey (
        id,
        week_number,
        title,
        description,
        session_date,
        start_time,
        end_time,
        status,
        is_completed,
        lesson_materials!lesson_materials_lesson_id_fkey (
          id,
          material_name,
          material_type,
          material_url,
          display_order,
          file_size
        )
      )
    `)
    .eq("id", classId)
    .single();

  if (classError) throw classError;
  return classData;
};

export const fetchTutorName = async (tutorId: string): Promise<string> => {
  const { data: tutorInfo, error: tutorError } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', tutorId)
    .single();

  let tutorName = "Unknown Tutor";
  
  if (tutorError) {
    console.error('Error fetching tutor profile:', tutorError);
    // Fallback to fetching email from auth.users if profile fetch fails
    try {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(tutorId);
      if (!userError && userData.user?.email) {
        tutorName = userData.user.email;
      }
    } catch (emailError) {
      console.error('Error fetching tutor email:', emailError);
    }
  } else {
    tutorName = tutorInfo?.full_name || "Unknown Tutor";
    
    // If full_name is empty or null, try to get email as fallback
    if (!tutorInfo?.full_name || tutorInfo.full_name.trim() === '') {
      try {
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(tutorId);
        if (!userError && userData.user?.email) {
          tutorName = userData.user.email;
        }
      } catch (emailError) {
        console.error('Error fetching tutor email as fallback:', emailError);
      }
    }
  }

  return tutorName;
};

export const checkEnrollmentStatus = async (userId: string, classId: string): Promise<{ isEnrolled: boolean; isCurrentBatch: boolean; enrolledBatch?: number }> => {
  // Get current class batch number
  const { data: classData } = await supabase
    .from('classes')
    .select('batch_number')
    .eq('id', classId)
    .single();

  // Check enrollment status for current batch
  const { data: currentBatchEnrollment } = await supabase
    .from('student_enrollments')
    .select('batch_number')
    .eq('student_id', userId)
    .eq('class_id', classId)
    .eq('batch_number', classData?.batch_number || 1)
    .eq('status', 'active')
    .single();

  // Check any enrollment for this class
  const { data: anyEnrollment } = await supabase
    .from('student_enrollments')
    .select('batch_number')
    .eq('student_id', userId)
    .eq('class_id', classId)
    .eq('status', 'active')
    .order('batch_number', { ascending: false })
    .limit(1)
    .single();

  return {
    isEnrolled: !!anyEnrollment,
    isCurrentBatch: !!currentBatchEnrollment,
    enrolledBatch: anyEnrollment?.batch_number
  };
};
