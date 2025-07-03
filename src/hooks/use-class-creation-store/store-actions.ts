import { ClassCreationState, ClassCreationActions } from './types';
import { supabase } from '@/integrations/supabase/client';

export const createStoreActions = (
  set: (fn: (state: ClassCreationState) => ClassCreationState) => void,
  get: () => ClassCreationState
): ClassCreationActions => ({
  setBasicInfo: (info: Partial<ClassCreationState['basicInfo']>) =>
    set((state) => ({
      ...state,
      basicInfo: { ...state.basicInfo, ...info },
    })),

  setSchedule: (schedule: Partial<ClassCreationState['schedule']>) =>
    set((state) => ({
      ...state,
      schedule: { ...state.schedule, ...schedule },
    })),

  setPricing: (pricing: Partial<ClassCreationState['pricing']>) =>
    set((state) => ({
      ...state,
      pricing: { ...state.pricing, ...pricing },
    })),

  setLocation: (location: Partial<ClassCreationState['location']>) =>
    set((state) => ({
      ...state,
      location: { ...state.location, ...location },
    })),

  setCurriculum: (curriculum: ClassCreationState['curriculum']) =>
    set((state) => ({
      ...state,
      curriculum,
    })),

  addLesson: (lesson: ClassCreationState['curriculum'][0]) =>
    set((state) => ({
      ...state,
      curriculum: [...state.curriculum, lesson],
    })),

  updateLesson: (index: number, lesson: Partial<ClassCreationState['curriculum'][0]>) =>
    set((state) => ({
      ...state,
      curriculum: state.curriculum.map((item, i) =>
        i === index ? { ...item, ...lesson } : item
      ),
    })),

  removeLesson: (index: number) =>
    set((state) => ({
      ...state,
      curriculum: state.curriculum.filter((_, i) => i !== index),
    })),

  setClassType: (classType: Partial<ClassCreationState['classType']>) =>
    set((state) => ({
      ...state,
      classType: { ...state.classType, ...classType },
    })),

  loadExistingClassData: async (classId: string) => {
    try {
      console.log('Loading existing class data for:', classId);
      
      // Fetch class details
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single();

      if (classError) {
        console.error('Error fetching class data:', classError);
        throw classError;
      }

      // Fetch class schedule
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('class_schedules')
        .select('*')
        .eq('class_id', classId)
        .maybeSingle();

      if (scheduleError) {
        console.error('Error fetching schedule data:', scheduleError);
      }

      // Fetch class location
      const { data: locationData, error: locationError } = await supabase
        .from('class_locations')
        .select('*')
        .eq('class_id', classId)
        .maybeSingle();

      if (locationError) {
        console.error('Error fetching location data:', locationError);
      }

      // Fetch class time slots
      const { data: timeSlotsData, error: timeSlotsError } = await supabase
        .from('class_time_slots')
        .select('*')
        .eq('class_id', classId);

      if (timeSlotsError) {
        console.error('Error fetching time slots data:', timeSlotsError);
      }

      // Fetch curriculum/syllabus data
      const { data: curriculumData, error: curriculumError } = await supabase
        .from('class_syllabus')
        .select('*')
        .eq('class_id', classId)
        .order('week_number', { ascending: true });

      if (curriculumError) {
        console.error('Error fetching curriculum data:', curriculumError);
      }

      console.log('Fetched curriculum data:', curriculumData);

      // Update store with fetched data
      set((state) => ({
        ...state,
        editingClassId: classId,
        basicInfo: {
          title: classData.title || '',
          description: classData.description || '',
          subject: classData.subject || '',
          thumbnailUrl: classData.thumbnail_url || '',
        },
        classType: {
          deliveryMode: classData.delivery_mode,
          classFormat: classData.class_format,
          classSize: classData.class_size,
          durationType: classData.duration_type,
          meetingLink: locationData?.meeting_link || '',
        },
        schedule: {
          startDate: scheduleData?.start_date ? new Date(scheduleData.start_date) : undefined,
          endDate: scheduleData?.end_date ? new Date(scheduleData.end_date) : undefined,
          frequency: scheduleData?.frequency || 'weekly',
          totalSessions: scheduleData?.total_sessions || 1,
          timeSlots: timeSlotsData?.map(slot => ({
            dayOfWeek: slot.day_of_week,
            startTime: slot.start_time,
            endTime: slot.end_time,
          })) || [],
        },
        pricing: {
          price: classData.price ? Number(classData.price) : 0,
          currency: classData.currency || 'USD',
          maxStudents: classData.max_students || 10,
          autoRenewal: classData.auto_renewal || false,
          enrollmentDeadline: classData.enrollment_deadline ? new Date(classData.enrollment_deadline) : undefined,
        },
        location: {
          street: locationData?.street || '',
          city: locationData?.city || '',
          state: locationData?.state || '',
          zipCode: locationData?.zip_code || '',
          country: locationData?.country || '',
          meetingLink: locationData?.meeting_link || '',
        },
        curriculum: curriculumData?.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          weekNumber: item.week_number,
          learningObjectives: item.learning_objectives || [],
          sessionDate: item.session_date ? new Date(item.session_date) : undefined,
          startTime: item.start_time || '',
          endTime: item.end_time || '',
          status: item.status || 'upcoming',
          notes: item.notes || '',
        })) || [],
      }));

      console.log('Successfully loaded existing class data');
    } catch (error) {
      console.error('Error loading existing class data:', error);
      throw error;
    }
  },

  reset: () =>
    set(() => ({
      currentStep: 1,
      editingClassId: null,
      basicInfo: {
        title: '',
        description: '',
        subject: '',
        thumbnailUrl: '',
      },
      classType: {
        deliveryMode: 'online',
        classFormat: 'live',
        classSize: 'group',
        durationType: 'recurring',
        meetingLink: '',
      },
      schedule: {
        startDate: undefined,
        endDate: undefined,
        frequency: 'weekly',
        totalSessions: 1,
        timeSlots: [],
      },
      pricing: {
        price: 0,
        currency: 'USD',
        maxStudents: 10,
        autoRenewal: false,
        enrollmentDeadline: undefined,
      },
      location: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        meetingLink: '',
      },
      curriculum: [],
    })),

  nextStep: () =>
    set((state) => ({
      ...state,
      currentStep: Math.min(state.currentStep + 1, 7),
    })),

  previousStep: () =>
    set((state) => ({
      ...state,
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  goToStep: (step: number) =>
    set((state) => ({
      ...state,
      currentStep: Math.max(1, Math.min(step, 7)),
    })),
});
