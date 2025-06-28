
import { ClassCreationState } from "@/hooks/use-class-creation-store";
import { LectureType } from "@/types/lecture-types";

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface AutoFillConfig {
  deliveryMode: ClassCreationState['deliveryMode'];
  classFormat: ClassCreationState['classFormat'];
  classSize: ClassCreationState['classSize'];
  durationType: ClassCreationState['durationType'];
  meetingLink?: string;
  maxStudents: number;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export type ClassTypeConfigs = Record<LectureType, Partial<ClassCreationState>>;
