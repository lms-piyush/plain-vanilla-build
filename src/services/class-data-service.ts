
import { supabase } from '@/integrations/supabase/client';
import { FormState } from '@/hooks/use-class-creation-store';

export const createClass = async (formState: FormState, status: 'draft' | 'active', userId: string) => {
  const { data, error } = await supabase
    .from('classes')
    .insert({
      title: formState.basicDetails.title,
      description: formState.basicDetails.description,
      subject: formState.basicDetails.subject,
      delivery_mode: formState.deliveryMode,
      class_format: formState.classFormat,
      class_size: formState.classSize,
      duration_type: formState.durationType,
      status,
      price: formState.pricing.price,
      currency: formState.pricing.currency,
      max_students: formState.pricing.maxStudents,
      auto_renewal: formState.pricing.autoRenewal,
      thumbnail_url: formState.basicDetails.thumbnailUrl,
      tutor_id: userId
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateClass = async (formState: FormState, status: 'draft' | 'active', classId: string) => {
  const { data, error } = await supabase
    .from('classes')
    .update({
      title: formState.basicDetails.title,
      description: formState.basicDetails.description,
      subject: formState.basicDetails.subject,
      delivery_mode: formState.deliveryMode,
      class_format: formState.classFormat,
      class_size: formState.classSize,
      duration_type: formState.durationType,
      status,
      price: formState.pricing.price,
      currency: formState.pricing.currency,
      max_students: formState.pricing.maxStudents,
      auto_renewal: formState.pricing.autoRenewal,
      thumbnail_url: formState.basicDetails.thumbnailUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', classId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
