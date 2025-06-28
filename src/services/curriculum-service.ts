
import { supabase } from "@/integrations/supabase/client";

export interface LessonData {
  title: string;
  description: string;
  session_date?: string;
  start_time?: string;
  end_time?: string;
  week_number?: number;
}

export const saveCurriculumToDatabase = async (
  classId: string,
  lessons: LessonData[]
) => {
  try {
    // First, delete existing syllabus entries for this class
    await supabase
      .from('class_syllabus')
      .delete()
      .eq('class_id', classId);

    // Insert new lesson data
    const syllabusEntries = lessons.map((lesson, index) => ({
      class_id: classId,
      title: lesson.title,
      description: lesson.description || null,
      week_number: lesson.week_number || index + 1,
      session_date: lesson.session_date || null,
      start_time: lesson.start_time || null,
      end_time: lesson.end_time || null,
      status: 'upcoming'
    }));

    const { error } = await supabase
      .from('class_syllabus')
      .insert(syllabusEntries);

    if (error) {
      throw new Error(`Failed to save curriculum: ${error.message}`);
    }

    console.log('Curriculum saved successfully:', syllabusEntries);
  } catch (error: any) {
    console.error('Error saving curriculum:', error);
    throw error;
  }
};
