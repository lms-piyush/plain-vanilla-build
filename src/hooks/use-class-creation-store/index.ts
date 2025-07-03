
import { create } from 'zustand';
import { ClassCreationStore } from './types';
import { initialState } from './initial-state';
import { createStoreActions } from './store-actions';

export const useClassCreationStore = create<ClassCreationStore>((set, get) => ({
  ...initialState,
  ...createStoreActions(set, get),
  get formState() {
    const state = get();
    return {
      currentStep: state.currentStep,
      editingClassId: state.editingClassId,
      deliveryMode: state.deliveryMode,
      classFormat: state.classFormat,
      classSize: state.classSize,
      durationType: state.durationType,
      title: state.title,
      subject: state.subject,
      description: state.description,
      thumbnailUrl: state.thumbnailUrl,
      frequency: state.frequency,
      startDate: state.startDate,
      endDate: state.endDate,
      enrollmentDeadline: state.enrollmentDeadline,
      totalSessions: state.totalSessions,
      timeSlots: state.timeSlots,
      price: state.price,
      currency: state.currency,
      maxStudents: state.maxStudents,
      autoRenewal: state.autoRenewal,
      meetingLink: state.meetingLink,
      address: state.address,
      curriculum: state.curriculum,
      syllabus: state.syllabus,
      materials: state.materials,
    };
  },
}));

// Re-export types for convenience
export * from './types';
