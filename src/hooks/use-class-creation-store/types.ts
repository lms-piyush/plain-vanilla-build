
// Define the types for our form state
export type DeliveryMode = 'online' | 'offline';
export type ClassFormat = 'live' | 'recorded' | 'inbound' | 'outbound';
export type ClassSize = 'group' | 'one-on-one';
export type DurationType = 'recurring' | 'fixed';
export type Frequency = 'daily' | 'weekly' | 'monthly';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type TimeSlot = {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
};

export type FormState = {
  // Step 1: Delivery & Type
  deliveryMode: DeliveryMode | null;
  classFormat: ClassFormat | null;
  classSize: ClassSize | null;
  durationType: DurationType | null;
  
  // Step 2: Details
  basicDetails: {
    title: string;
    subject: string;
    description: string;
    thumbnailUrl: string;
  };
  
  // Step 3: Schedule
  schedule: {
    frequency: Frequency | null;
    startDate: string | null;
    endDate: string | null;
    totalSessions: number | null;
  };
  timeSlots: TimeSlot[];
  
  // Step 4: Pricing & Capacity
  pricing: {
    price: number | null;
    currency: string;
    maxStudents: number | null;
    autoRenewal: boolean;
  };
  
  // Step 5: Location/Links
  location: {
    meetingLink: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  
  // Step 6: Curriculum
  syllabus: { title: string; description: string }[];
  materials: { name: string; type: string; url: string; lessonIndex: number }[];
};

export type ClassCreationState = {
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
  startDate: string | null;
  endDate: string | null;
  totalSessions: number | null;
  timeSlots: TimeSlot[];
  
  // Step 4: Pricing & Capacity
  price: number | null;
  currency: string;
  maxStudents: number | null;
  autoRenewal: boolean;
  
  // Step 5: Location/Links
  meetingLink: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Step 6: Curriculum
  syllabus: { title: string; description: string }[];
  materials: { name: string; type: string; url: string; lessonIndex: number }[];
};
