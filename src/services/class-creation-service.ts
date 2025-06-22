
import { supabase } from "@/integrations/supabase/client";
import { ClassCreationState } from "@/hooks/use-class-creation-store";

export const saveClass = async (formState: ClassCreationState, status: 'draft' | 'active') => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in to create a class');

  // Create the main class record
  const { data: classData, error: classError } = await supabase
    .from('classes')
    .insert({
      title: formState.title,
      description: formState.description,
      subject: formState.subject,
      delivery_mode: formState.deliveryMode,
      class_format: formState.classFormat,
      class_size: formState.classSize,
      duration_type: formState.durationType,
      status: status,
      price: formState.price || 0, // Allow 0 for free classes
      currency: formState.currency,
      max_students: formState.maxStudents,
      auto_renewal: formState.autoRenewal,
      thumbnail_url: formState.thumbnailUrl,
      tutor_id: user.id,
      frequency: formState.frequency, // Include frequency
      total_sessions: formState.totalSessions
    })
    .select('id')
    .single();

  if (classError) throw classError;
  const classId = classData.id;

  // Save schedule if available
  if (formState.startDate) {
    await supabase.from('class_schedules').insert({
      class_id: classId,
      start_date: formState.startDate,
      end_date: formState.endDate,
      frequency: formState.frequency,
      total_sessions: formState.totalSessions
    });
  }

  // Save time slots
  if (formState.timeSlots.length > 0) {
    await supabase.from('class_time_slots').insert(
      formState.timeSlots.map(slot => ({
        class_id: classId,
        day_of_week: slot.day,
        start_time: slot.startTime,
        end_time: slot.endTime
      }))
    );
  }

  // Save location information
  const locationData: any = { class_id: classId };
  if (formState.deliveryMode === 'online' && formState.meetingLink) {
    locationData.meeting_link = formState.meetingLink;
  } else if (formState.deliveryMode === 'offline') {
    locationData.street_address = formState.address.street;
    locationData.city = formState.address.city;
    locationData.state = formState.address.state;
    locationData.zip_code = formState.address.zipCode;
    locationData.country = formState.address.country;
  }
  
  if (Object.keys(locationData).length > 1) {
    await supabase.from('class_locations').insert(locationData);
  }

  // Save syllabus if available
  if (formState.syllabus.length > 0) {
    await supabase.from('class_syllabus').insert(
      formState.syllabus.map((item, index) => ({
        class_id: classId,
        title: item.title,
        description: item.description,
        order_index: index
      }))
    );
  }

  console.log('Class created successfully with ID:', classId);
  return classId;
};
