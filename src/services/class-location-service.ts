
import { supabase } from '@/integrations/supabase/client';
import { FormState } from '@/hooks/use-class-creation-store';

export const saveClassLocation = async (formState: FormState, classId: string, isEditing: boolean) => {
  const hasLocationData = formState.location.meetingLink || 
    formState.location.address.street || 
    formState.location.address.city;
  
  if (!hasLocationData) return;

  if (isEditing) {
    // Delete existing location
    await supabase
      .from('class_locations')
      .delete()
      .eq('class_id', classId);
  }

  // Insert new location
  await supabase
    .from('class_locations')
    .insert({
      class_id: classId,
      meeting_link: formState.location.meetingLink,
      street: formState.location.address.street,
      city: formState.location.address.city,
      state: formState.location.address.state,
      zip_code: formState.location.address.zipCode,
      country: formState.location.address.country
    });
};
