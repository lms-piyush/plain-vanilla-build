
import { supabase } from '@/integrations/supabase/client';
import { FormState } from '@/hooks/use-class-creation-store';

export const saveClassSchedule = async (formState: FormState, classId: string, isEditing: boolean) => {
  if (!formState.schedule.frequency && formState.durationType === 'recurring') return;

  if (isEditing) {
    // Delete existing schedule
    await supabase
      .from('class_schedules')
      .delete()
      .eq('class_id', classId);
  }

  // Insert new schedule only for recurring classes
  if (formState.durationType === 'recurring' && formState.schedule.frequency) {
    await supabase
      .from('class_schedules')
      .insert({
        class_id: classId,
        start_date: formState.schedule.startDate,
        end_date: formState.schedule.endDate,
        frequency: formState.schedule.frequency,
        total_sessions: formState.schedule.totalSessions
      });
  }
};

export const saveClassTimeSlots = async (formState: FormState, classId: string, isEditing: boolean) => {
  if (formState.timeSlots.length === 0) return;

  if (isEditing) {
    // Delete existing time slots
    await supabase
      .from('class_time_slots')
      .delete()
      .eq('class_id', classId);
  }

  // Insert new time slots - supporting multiple slots per frequency
  const timeSlotData = formState.timeSlots.map(slot => ({
    class_id: classId,
    day_of_week: slot.dayOfWeek,
    start_time: slot.startTime,
    end_time: slot.endTime
  }));

  if (timeSlotData.length > 0) {
    await supabase
      .from('class_time_slots')
      .insert(timeSlotData);
  }
};

// Helper function to get existing class schedule data for editing
export const getExistingClassSchedule = async (classId: string) => {
  try {
    // Get schedule data
    const { data: scheduleData } = await supabase
      .from('class_schedules')
      .select('*')
      .eq('class_id', classId)
      .maybeSingle();

    // Get time slots data
    const { data: timeSlotsData } = await supabase
      .from('class_time_slots')
      .select('*')
      .eq('class_id', classId);

    return {
      schedule: scheduleData,
      timeSlots: timeSlotsData || []
    };
  } catch (error) {
    console.error('Error fetching existing schedule:', error);
    return {
      schedule: null,
      timeSlots: []
    };
  }
};
