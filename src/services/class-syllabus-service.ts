
import { supabase } from '@/integrations/supabase/client';
import { FormState } from '@/hooks/use-class-creation-store';

export const saveClassSyllabus = async (formState: FormState, classId: string, isEditing: boolean) => {
  if (formState.syllabus.length === 0) return;

  if (isEditing) {
    // Delete existing syllabus and materials
    const { data: existingLessons } = await supabase
      .from('class_syllabus')
      .select('id')
      .eq('class_id', classId);

    if (existingLessons && existingLessons.length > 0) {
      const lessonIds = existingLessons.map(lesson => lesson.id);
      
      // Delete lesson materials first
      await supabase
        .from('lesson_materials')
        .delete()
        .in('lesson_id', lessonIds);
    }

    // Delete syllabus
    await supabase
      .from('class_syllabus')
      .delete()
      .eq('class_id', classId);
  }

  // Insert new syllabus
  const syllabusData = formState.syllabus.map((lesson, index) => ({
    class_id: classId,
    week_number: index + 1,
    title: lesson.title,
    description: lesson.description
  }));

  const { data: insertedLessons } = await supabase
    .from('class_syllabus')
    .insert(syllabusData)
    .select();

  return insertedLessons;
};

export const saveClassMaterials = async (formState: FormState, insertedLessons: any[]) => {
  if (!insertedLessons || formState.materials.length === 0) return;

  const materialsData: any[] = [];
  
  formState.materials.forEach(material => {
    const lessonId = insertedLessons[material.lessonIndex]?.id;
    if (lessonId) {
      materialsData.push({
        lesson_id: lessonId,
        material_name: material.name,
        material_type: material.type,
        material_url: material.url,
        display_order: 0
      });
    }
  });

  if (materialsData.length > 0) {
    await supabase
      .from('lesson_materials')
      .insert(materialsData);
  }
};
