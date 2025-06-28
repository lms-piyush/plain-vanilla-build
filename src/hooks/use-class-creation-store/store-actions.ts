
import { 
  ClassCreationState, 
  DeliveryMode, 
  ClassFormat, 
  ClassSize, 
  DurationType, 
  Frequency,
  TimeSlot 
} from './types';

export type ClassCreationActions = {
  setDeliveryMode: (mode: DeliveryMode) => void;
  setClassFormat: (format: ClassFormat) => void;
  setClassSize: (size: ClassSize) => void;
  setDurationType: (type: DurationType) => void;
  setBasicDetails: (details: Pick<ClassCreationState, 'title' | 'subject' | 'description' | 'thumbnailUrl'>) => void;
  setSchedule: (schedule: Pick<ClassCreationState, 'frequency' | 'startDate' | 'endDate' | 'enrollmentDeadline' | 'totalSessions'>) => void;
  addTimeSlot: (timeSlot: TimeSlot) => void;
  removeTimeSlot: (index: number) => void;
  updateTimeSlot: (index: number, timeSlot: TimeSlot) => void;
  setTimeSlots: (timeSlots: TimeSlot[]) => void;
  setPricing: (pricing: Pick<ClassCreationState, 'price' | 'currency' | 'maxStudents' | 'autoRenewal'>) => void;
  setLocation: (location: Pick<ClassCreationState, 'meetingLink' | 'address'>) => void;
  setSyllabus: (syllabus: { title: string; description: string }[]) => void;
  addSyllabusItem: (item: { title: string; description: string }) => void;
  removeSyllabusItem: (index: number) => void;
  updateSyllabusItem: (index: number, item: { title: string; description: string }) => void;
  addMaterial: (material: { name: string; type: string; url: string; lessonIndex: number }) => void;
  removeMaterial: (index: number) => void;
  reset: () => void;
};

export type ClassCreationStore = {
  formState: ClassCreationState;
} & ClassCreationActions;
