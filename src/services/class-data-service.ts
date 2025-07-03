
import { supabase } from '@/integrations/supabase/client';
import { ClassCreationState } from '@/hooks/use-class-creation-store';

export const createClass = async (formState: ClassCreationState, status: 'draft' | 'active', userId: string) => {
  const { data, error } = await supabase
    .from('classes')
    .insert({
      title: formState.title,
      description: formState.description,
      subject: formState.subject,
      delivery_mode: formState.deliveryMode,
      class_format: formState.classFormat,
      class_size: formState.classSize,
      duration_type: formState.durationType,
      status,
      price: formState.price,
      currency: formState.currency,
      max_students: formState.maxStudents,
      auto_renewal: formState.autoRenewal,
      thumbnail_url: formState.thumbnailUrl,
      enrollment_deadline: formState.enrollmentDeadline,
      tutor_id: userId
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateClass = async (formState: ClassCreationState, status: 'draft' | 'active', classId: string) => {
  const { data, error } = await supabase
    .from('classes')
    .update({
      title: formState.title,
      description: formState.description,
      subject: formState.subject,
      delivery_mode: formState.deliveryMode,
      class_format: formState.classFormat,
      class_size: formState.classSize,
      duration_type: formState.durationType,
      status,
      price: formState.price,
      currency: formState.currency,
      max_students: formState.maxStudents,
      auto_renewal: formState.autoRenewal,
      thumbnail_url: formState.thumbnailUrl,
      enrollment_deadline: formState.enrollmentDeadline,
      updated_at: new Date().toISOString()
    })
    .eq('id', classId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
