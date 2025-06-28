
import { useMemo } from "react";

interface UseSessionDateTimeProps {
  classDetails?: any;
  nextSessionNumber: number;
}

export const useSessionDateTime = ({ classDetails, nextSessionNumber }: UseSessionDateTimeProps) => {
  return useMemo(() => {
    if (!classDetails?.class_schedules?.[0] || !classDetails?.class_time_slots?.[0]) {
      return {
        date: new Date().toISOString().split('T')[0],
        startTime: '16:00',
        endTime: '17:30'
      };
    }

    const schedule = classDetails.class_schedules[0];
    const timeSlot = classDetails.class_time_slots[0];
    const startDate = new Date(schedule.start_date || new Date());
    
    // Calculate next session date based on frequency and session number
    const nextSessionDate = new Date(startDate);
    const sessionIndex = nextSessionNumber - 1;
    
    if (schedule.frequency === 'weekly') {
      nextSessionDate.setDate(startDate.getDate() + (sessionIndex * 7));
    } else if (schedule.frequency === 'daily') {
      nextSessionDate.setDate(startDate.getDate() + sessionIndex);
    } else if (schedule.frequency === 'monthly') {
      nextSessionDate.setMonth(startDate.getMonth() + sessionIndex);
    }

    return {
      date: nextSessionDate.toISOString().split('T')[0],
      startTime: timeSlot.start_time,
      endTime: timeSlot.end_time
    };
  }, [classDetails, nextSessionNumber]);
};
