
import { createClass, updateClass } from './class-data-service';
import { saveClassLocation } from './class-location-service';
import { saveClassSchedule, saveClassTimeSlots } from './class-schedule-service';
import { saveClassSyllabus, saveClassMaterials } from './class-syllabus-service';
import { FormState } from '@/hooks/use-class-creation-store';
import { supabase } from '@/integrations/supabase/client';

export const saveClass = async (
  formState: FormState, 
  status: 'draft' | 'active', 
  classId?: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const isEditing = !!classId;
  let savedClass;

  if (isEditing) {
    savedClass = await updateClass(formState, status, classId);
  } else {
    savedClass = await createClass(formState, status, user.id);
  }

  const finalClassId = savedClass.id;

  // Save related data
  await Promise.all([
    saveClassLocation(formState, finalClassId, isEditing),
    saveClassSchedule(formState, finalClassId, isEditing),
    saveClassTimeSlots(formState, finalClassId, isEditing),
  ]);

  // Save syllabus and materials
  const insertedLessons = await saveClassSyllabus(formState, finalClassId, isEditing);
  if (insertedLessons) {
    await saveClassMaterials(formState, insertedLessons);
  }

  return savedClass;
};
