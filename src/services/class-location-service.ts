
import { supabase } from '@/integrations/supabase/client';
import { ClassCreationState } from '@/hooks/use-class-creation-store';

export const saveClassLocation = async (formState: ClassCreationState, classId: string, isEditing: boolean) => {
  const hasLocationData = formState.meetingLink || 
    formState.address.street || 
    formState.address.city;
  
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
      meeting_link: formState.meetingLink,
      street: formState.address.street,
      city: formState.address.city,
      state: formState.address.state,
      zip_code: formState.address.zipCode,
      country: formState.address.country
    });
};
