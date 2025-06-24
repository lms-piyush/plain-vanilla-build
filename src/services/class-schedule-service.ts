
import { supabase } from '@/integrations/supabase/client';
import { FormState } from '@/hooks/use-class-creation-store';

export const saveClassSchedule = async (formState: FormState, classId: string, isEditing: boolean) => {
  if (!formState.schedule.frequency) return;

  if (isEditing) {
    // Delete existing schedule
    await supabase
      .from('class_schedules')
      .delete()
      .eq('class_id', classId);
  }

  // Insert new schedule
  await supabase
    .from('class_schedules')
    .insert({
      class_id: classId,
      start_date: formState.schedule.startDate,
      end_date: formState.schedule.endDate,
      frequency: formState.schedule.frequency,
      total_sessions: formState.schedule.totalSessions
    });
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

  // Insert new time slots
  const timeSlotData = formState.timeSlots.map(slot => ({
    class_id: classId,
    day_of_week: slot.dayOfWeek,
    start_time: slot.startTime,
    end_time: slot.endTime
  }));

  await supabase
    .from('class_time_slots')
    .insert(timeSlotData);
};
