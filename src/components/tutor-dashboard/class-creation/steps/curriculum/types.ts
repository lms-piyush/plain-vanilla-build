import { TimeSlot, Frequency, LessonItem } from '@/hooks/use-class-creation-store/types';

export interface SessionGenerationParams {
  frequency: Frequency;
  startDate: Date;
  endDate: Date;
  enrollmentDeadline?: Date;
  timeSlots: TimeSlot[];
}

export interface GeneratedSession {
  sessionDate: Date;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
}

export type { TimeSlot, Frequency, LessonItem };