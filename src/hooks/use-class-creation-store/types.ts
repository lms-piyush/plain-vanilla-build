
export interface LessonItem {
  id?: string;
  title: string;
  description: string;
  weekNumber: number;
  learningObjectives: string[];
  sessionDate?: Date;
  startTime: string;
  endTime: string;
  status?: string;
  notes: string;
}

export interface ClassCreationState {
  currentStep: number;
  editingClassId: string | null;
  
  basicInfo: {
    title: string;
    description: string;
    subject: string;
    thumbnailUrl: string;
  };
  
  classType: {
    deliveryMode: 'online' | 'offline';
    classFormat: 'live' | 'recorded' | 'inbound' | 'outbound';
    classSize: 'group' | 'one-on-one';
    durationType: 'recurring' | 'fixed';
    meetingLink: string;
  };
  
  schedule: {
    startDate?: Date;
    endDate?: Date;
    frequency: string;
    totalSessions: number;
    timeSlots: Array<{
      dayOfWeek: string;
      startTime: string;
      endTime: string;
    }>;
  };
  
  pricing: {
    price: number;
    currency: string;
    maxStudents: number;
    autoRenewal: boolean;
    enrollmentDeadline?: Date;
  };
  
  location: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    meetingLink: string;
  };
  
  curriculum: LessonItem[];
}

export interface ClassCreationActions {
  setBasicInfo: (info: Partial<ClassCreationState['basicInfo']>) => void;
  setClassType: (classType: Partial<ClassCreationState['classType']>) => void;
  setSchedule: (schedule: Partial<ClassCreationState['schedule']>) => void;
  setPricing: (pricing: Partial<ClassCreationState['pricing']>) => void;
  setLocation: (location: Partial<ClassCreationState['location']>) => void;
  setCurriculum: (curriculum: ClassCreationState['curriculum']) => void;
  addLesson: (lesson: LessonItem) => void;
  updateLesson: (index: number, lesson: Partial<LessonItem>) => void;
  removeLesson: (index: number) => void;
  loadExistingClassData: (classId: string) => Promise<void>;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

export type ClassCreationStore = ClassCreationState & ClassCreationActions;
