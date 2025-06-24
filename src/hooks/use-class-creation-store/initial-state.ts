
import { ClassCreationState } from './types';

export const initialState: ClassCreationState = {
  // Step 1: Delivery & Type
  deliveryMode: null,
  classFormat: null,
  classSize: null,
  durationType: null,
  
  // Step 2: Details
  title: '',
  subject: '',
  description: '',
  thumbnailUrl: '',
  
  // Step 3: Schedule
  frequency: null,
  startDate: null,
  endDate: null,
  totalSessions: null,
  timeSlots: [],
  
  // Step 4: Pricing & Capacity
  price: null,
  currency: 'USD',
  maxStudents: null,
  autoRenewal: false,
  
  // Step 5: Location/Links
  meetingLink: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  
  // Step 6: Curriculum
  syllabus: [],
  materials: [],
};
