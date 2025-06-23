
import { supabase } from "@/integrations/supabase/client";

export interface LessonMaterial {
  id?: string;
  lesson_id: string;
  material_name: string;
  material_type: string;
  material_url: string;
  display_order: number;
}

export const saveLessonMaterials = async (lessonId: string, materials: Omit<LessonMaterial, 'id' | 'lesson_id'>[]) => {
  if (materials.length === 0) return;

  const materialsToInsert = materials.map((material, index) => ({
    lesson_id: lessonId,
    material_name: material.material_name,
    material_type: material.material_type,
    material_url: material.material_url,
    display_order: material.display_order || index
  }));

  const { error } = await supabase
    .from('lesson_materials')
    .insert(materialsToInsert);

  if (error) {
    console.error('Error saving lesson materials:', error);
    throw new Error(`Failed to save lesson materials: ${error.message}`);
  }
};

export const getLessonMaterials = async (lessonId: string) => {
  const { data, error } = await supabase
    .from('lesson_materials')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('display_order');

  if (error) {
    console.error('Error fetching lesson materials:', error);
    throw new Error(`Failed to fetch lesson materials: ${error.message}`);
  }

  return data || [];
};
