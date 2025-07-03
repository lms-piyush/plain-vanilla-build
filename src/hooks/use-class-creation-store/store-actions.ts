
import { ClassCreationState, ClassCreationActions } from './types';
import { supabase } from '@/integrations/supabase/client';

export const createStoreActions = (
  set: (fn: (state: ClassCreationState) => ClassCreationState) => void,
  get: () => ClassCreationState
): ClassCreationActions => ({
  setDeliveryMode: (mode) =>
    set((state) => ({
      ...state,
      deliveryMode: mode,
      // Reset dependent fields when changing delivery mode
      classFormat: null,
      classSize: null 
    })),

  setClassFormat: (format) =>
    set((state) => ({
      ...state,
      classFormat: format,
      // Reset dependent fields
      classSize: format === 'inbound' ? 'one-on-one' : state.classSize
    })),

  setClassSize: (size) =>
    set((state) => ({
      ...state,
      classSize: size,
      // Update max students if one-on-one
      maxStudents: size === 'one-on-one' ? 1 : state.maxStudents
    })),

  setDurationType: (type) =>
    set((state) => ({
      ...state,
      durationType: type
    })),

  setBasicDetails: (details) =>
    set((state) => ({
      ...state,
      ...details
    })),

  setSchedule: (schedule) =>
    set((state) => ({
      ...state,
      ...schedule
    })),

  setPricing: (pricing) =>
    set((state) => ({
      ...state,
      ...pricing
    })),

  setLocation: (location) =>
    set((state) => ({
      ...state,
      ...location
    })),

  setCurriculum: (curriculum) =>
    set((state) => ({
      ...state,
      curriculum,
    })),

  setSyllabus: (syllabus) =>
    set((state) => ({
      ...state,
      syllabus,
    })),

  addLesson: (lesson) =>
    set((state) => ({
      ...state,
      curriculum: [...state.curriculum, lesson],
    })),

  updateLesson: (index, lesson) =>
    set((state) => ({
      ...state,
      curriculum: state.curriculum.map((item, i) =>
        i === index ? { ...item, ...lesson } : item
      ),
    })),

  removeLesson: (index) =>
    set((state) => ({
      ...state,
      curriculum: state.curriculum.filter((_, i) => i !== index),
    })),

  addTimeSlot: (timeSlot) =>
    set((state) => ({
      ...state,
      timeSlots: [...state.timeSlots, timeSlot],
    })),

  removeTimeSlot: (index) =>
    set((state) => ({
      ...state,
      timeSlots: state.timeSlots.filter((_, i) => i !== index),
    })),

  updateTimeSlot: (index, timeSlot) =>
    set((state) => ({
      ...state,
      timeSlots: state.timeSlots.map((ts, i) => (i === index ? timeSlot : ts)),
    })),

  setTimeSlots: (timeSlots) =>
    set((state) => ({
      ...state,
      timeSlots,
    })),

  addSyllabusItem: (item) =>
    set((state) => ({
      ...state,
      syllabus: [...state.syllabus, item],
    })),

  removeSyllabusItem: (index) =>
    set((state) => ({
      ...state,
      syllabus: state.syllabus.filter((_, i) => i !== index),
    })),

  updateSyllabusItem: (index, item) =>
    set((state) => ({
      ...state,
      syllabus: state.syllabus.map((si, i) => (i === index ? item : si)),
    })),

  addMaterial: (material) =>
    set((state) => ({
      ...state,
      materials: [...state.materials, material],
    })),

  removeMaterial: (index) =>
    set((state) => ({
      ...state,
      materials: state.materials.filter((_, i) => i !== index),
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
        title: classData.title || '',
        description: classData.description || '',
        subject: classData.subject || '',
        thumbnailUrl: classData.thumbnail_url || '',
        deliveryMode: classData.delivery_mode,
        classFormat: classData.class_format,
        classSize: classData.class_size,
        durationType: classData.duration_type,
        meetingLink: locationData?.meeting_link || '',
        startDate: scheduleData?.start_date ? new Date(scheduleData.start_date) : null,
        endDate: scheduleData?.end_date ? new Date(scheduleData.end_date) : null,
        frequency: scheduleData?.frequency as any || null,
        totalSessions: scheduleData?.total_sessions || null,
        timeSlots: timeSlotsData?.map(slot => ({
          dayOfWeek: slot.day_of_week,
          startTime: slot.start_time,
          endTime: slot.end_time,
        })) || [],
        price: classData.price ? Number(classData.price) : null,
        currency: classData.currency || 'USD',
        maxStudents: classData.max_students || null,
        autoRenewal: classData.auto_renewal || false,
        enrollmentDeadline: classData.enrollment_deadline ? new Date(classData.enrollment_deadline) : null,
        address: {
          street: locationData?.street || '',
          city: locationData?.city || '',
          state: locationData?.state || '',
          zipCode: locationData?.zip_code || '',
          country: locationData?.country || '',
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
        syllabus: curriculumData?.map(item => ({
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
      deliveryMode: null,
      classFormat: null,
      classSize: null,
      durationType: null,
      title: '',
      subject: '',
      description: '',
      thumbnailUrl: '',
      frequency: null,
      startDate: null,
      endDate: null,
      enrollmentDeadline: null,
      totalSessions: null,
      timeSlots: [],
      price: null,
      currency: 'USD',
      maxStudents: null,
      autoRenewal: false,
      meetingLink: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      curriculum: [],
      syllabus: [],
      materials: [],
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
