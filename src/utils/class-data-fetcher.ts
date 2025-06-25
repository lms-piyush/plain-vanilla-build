
import { supabase } from "@/integrations/supabase/client";

export const fetchClassData = async (classId: string, userId: string) => {
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
        attendance,
        notes,
        lesson_materials!lesson_materials_lesson_id_fkey (
          id,
          material_name,
          material_type,
          material_url,
          display_order,
          file_size,
          upload_date,
          download_count,
          file_path
        )
      )
    `)
    .eq("id", classId)
    .eq("tutor_id", userId)
    .single();

  if (classError) throw classError;

  return classData;
};
