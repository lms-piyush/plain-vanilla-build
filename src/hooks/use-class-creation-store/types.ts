
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

export interface TimeSlot {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface Material {
  name: string;
  type: string;
  url?: string;
  lessonIndex?: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type DeliveryMode = 'online' | 'offline';
export type ClassFormat = 'live' | 'recorded' | 'inbound' | 'outbound';
export type ClassSize = 'group' | 'one-on-one';
export type DurationType = 'recurring' | 'fixed';
export type Frequency = 'daily' | 'weekly' | 'monthly';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface ClassCreationState {
  currentStep: number;
  editingClassId: string | null;
  
  // Step 1: Delivery & Type
  deliveryMode: DeliveryMode | null;
  classFormat: ClassFormat | null;
  classSize: ClassSize | null;
  durationType: DurationType | null;
  
  // Step 2: Details
  title: string;
  subject: string;
  description: string;
  thumbnailUrl: string;
  
  // Step 3: Schedule
  frequency: Frequency | null;
  startDate: Date | null;
  endDate: Date | null;
  enrollmentDeadline: Date | null;
  totalSessions: number | null;
  timeSlots: TimeSlot[];
  
  // Step 4: Pricing & Capacity
  price: number | null;
  currency: string;
  maxStudents: number | null;
  autoRenewal: boolean;
  
  // Step 5: Location/Links
  meetingLink: string;
  address: Address;
  
  // Step 6: Curriculum
  curriculum: LessonItem[];
  syllabus: LessonItem[];
  materials: Material[];
}

export interface ClassCreationActions {
  setDeliveryMode: (mode: DeliveryMode | null) => void;
  setClassFormat: (format: ClassFormat | null) => void;
  setClassSize: (size: ClassSize | null) => void;
  setDurationType: (type: DurationType | null) => void;
  setBasicDetails: (details: Partial<Pick<ClassCreationState, 'title' | 'subject' | 'description' | 'thumbnailUrl'>>) => void;
  setSchedule: (schedule: Partial<Pick<ClassCreationState, 'frequency' | 'startDate' | 'endDate' | 'enrollmentDeadline' | 'totalSessions'>>) => void;
  setPricing: (pricing: Partial<Pick<ClassCreationState, 'price' | 'currency' | 'maxStudents' | 'autoRenewal'>>) => void;
  setLocation: (location: Partial<Pick<ClassCreationState, 'meetingLink' | 'address'>>) => void;
  setCurriculum: (curriculum: LessonItem[]) => void;
  setSyllabus: (syllabus: LessonItem[]) => void;
  addLesson: (lesson: LessonItem) => void;
  updateLesson: (index: number, lesson: Partial<LessonItem>) => void;
  removeLesson: (index: number) => void;
  addTimeSlot: (timeSlot: TimeSlot) => void;
  removeTimeSlot: (index: number) => void;
  updateTimeSlot: (index: number, timeSlot: TimeSlot) => void;
  setTimeSlots: (timeSlots: TimeSlot[]) => void;
  addSyllabusItem: (item: LessonItem) => void;
  removeSyllabusItem: (index: number) => void;
  updateSyllabusItem: (index: number, item: LessonItem) => void;
  addMaterial: (material: Material) => void;
  removeMaterial: (index: number) => void;
  loadExistingClassData: (classId: string) => Promise<void>;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

export type ClassCreationStore = ClassCreationState & ClassCreationActions & {
  formState: ClassCreationState;
};

// Legacy types for backward compatibility
export type FormState = ClassCreationState;
