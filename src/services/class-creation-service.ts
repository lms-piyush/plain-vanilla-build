
import { supabase } from "@/integrations/supabase/client";
import { ClassCreationState } from "@/hooks/use-class-creation-store";
import { saveCurriculumToDatabase } from "./curriculum-service";

export const saveClass = async (
  formState: ClassCreationState, 
  status: 'draft' | 'active' = 'draft',
  classId?: string
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('You must be logged in to create a class');
    }

    // Prepare class data
    const classData = {
      title: formState.title,
      description: formState.description,
      subject: formState.subject,
      thumbnail_url: formState.thumbnailUrl,
      delivery_mode: formState.deliveryMode,
      class_format: formState.classFormat,
      class_size: formState.classSize,
      duration_type: formState.durationType,
      price: formState.price,
      currency: formState.currency,
      max_students: formState.maxStudents,
      auto_renewal: formState.autoRenewal,
      enrollment_deadline: formState.enrollmentDeadline,
      status: status,
      updated_at: new Date().toISOString()
    };

    let finalClassId: string;

    if (classId) {
      // Update existing class
      const { error } = await supabase
        .from('classes')
        .update(classData)
        .eq('id', classId);

      if (error) throw error;
      finalClassId = classId;
    } else {
      // Create new class
      const { data: newClass, error } = await supabase
        .from('classes')
        .insert({
          ...classData,
          tutor_id: user.id
        })
        .select('id')
        .single();

      if (error) throw error;
      finalClassId = newClass.id;
    }

    // Save schedule data
    if (formState.startDate) {
      // Delete existing schedule
      await supabase
        .from('class_schedules')
        .delete()
        .eq('class_id', finalClassId);

      // Insert new schedule
      const { error: scheduleError } = await supabase
        .from('class_schedules')
        .insert({
          class_id: finalClassId,
          start_date: formState.startDate,
          end_date: formState.endDate,
          frequency: formState.frequency,
          total_sessions: formState.totalSessions
        });

      if (scheduleError) throw scheduleError;
    }

    // Save time slots
    if (formState.timeSlots && formState.timeSlots.length > 0) {
      // Delete existing time slots
      await supabase
        .from('class_time_slots')
        .delete()
        .eq('class_id', finalClassId);

      // Insert new time slots
      const timeSlotData = formState.timeSlots.map(slot => ({
        class_id: finalClassId,
        day_of_week: slot.dayOfWeek,
        start_time: slot.startTime,
        end_time: slot.endTime
      }));

      const { error: timeSlotsError } = await supabase
        .from('class_time_slots')
        .insert(timeSlotData);

      if (timeSlotsError) throw timeSlotsError;
    }

    // Save location data
    if (formState.meetingLink || 
        formState.address.street || 
        formState.address.city) {
      
      // Delete existing location
      await supabase
        .from('class_locations')
        .delete()
        .eq('class_id', finalClassId);

      // Insert new location
      const { error: locationError } = await supabase
        .from('class_locations')
        .insert({
          class_id: finalClassId,
          meeting_link: formState.meetingLink || null,
          street: formState.address.street || null,
          city: formState.address.city || null,
          state: formState.address.state || null,
          zip_code: formState.address.zipCode || null,
          country: formState.address.country || null
        });

      if (locationError) throw locationError;
    }

    // Save curriculum data with session dates and times
    if (formState.syllabus && formState.syllabus.length > 0) {
      await saveCurriculumToDatabase(finalClassId, formState.syllabus);
    }

    return { classId: finalClassId };
  } catch (error: any) {
    console.error('Error saving class:', error);
    throw new Error(error.message || 'Failed to save class');
  }
};
