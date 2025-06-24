
import { create } from 'zustand';
import { ClassCreationStore } from './store-actions';
import { initialState } from './initial-state';

export const useClassCreationStore = create<ClassCreationStore>((set) => ({
  formState: initialState,
  
  setDeliveryMode: (mode) => set((state) => ({ 
    formState: { 
      ...state.formState, 
      deliveryMode: mode,
      // Reset dependent fields when changing delivery mode
      classFormat: null,
      classSize: null 
    } 
  })),
  
  setClassFormat: (format) => set((state) => ({ 
    formState: { 
      ...state.formState, 
      classFormat: format,
      // Reset dependent fields
      classSize: format === 'inbound' ? 'one-on-one' : state.formState.classSize
    } 
  })),
  
  setClassSize: (size) => set((state) => ({ 
    formState: { 
      ...state.formState, 
      classSize: size,
      // Update max students if one-on-one
      maxStudents: size === 'one-on-one' ? 1 : state.formState.maxStudents
    } 
  })),
  
  setDurationType: (type) => set((state) => ({ 
    formState: { ...state.formState, durationType: type } 
  })),
  
  setBasicDetails: (details) => set((state) => ({ 
    formState: { ...state.formState, ...details } 
  })),
  
  setSchedule: (schedule) => set((state) => ({ 
    formState: { ...state.formState, ...schedule } 
  })),
  
  addTimeSlot: (timeSlot) => set((state) => ({ 
    formState: { 
      ...state.formState, 
      timeSlots: [...state.formState.timeSlots, timeSlot] 
    } 
  })),
  
  removeTimeSlot: (index) => set((state) => ({ 
    formState: { 
      ...state.formState, 
      timeSlots: state.formState.timeSlots.filter((_, i) => i !== index) 
    } 
  })),
  
  updateTimeSlot: (index, timeSlot) => set((state) => ({ 
    formState: { 
      ...state.formState, 
      timeSlots: state.formState.timeSlots.map((ts, i) => i === index ? timeSlot : ts) 
    } 
  })),
  
  setTimeSlots: (timeSlots) => set((state) => ({ 
    formState: { 
      ...state.formState, 
      timeSlots 
    } 
  })),
  
  setPricing: (pricing) => set((state) => ({ 
    formState: { ...state.formState, ...pricing } 
  })),
  
  setLocation: (location) => set((state) => ({ 
    formState: { ...state.formState, ...location } 
  })),
  
  setSyllabus: (syllabus) => set((state) => ({ 
    formState: { ...state.formState, syllabus } 
  })),
  
  addSyllabusItem: (item) => set((state) => ({ 
    formState: { 
      ...state.formState, 
      syllabus: [...state.formState.syllabus, item] 
    } 
  })),
  
  removeSyllabusItem: (index) => set((state) => ({ 
    formState: { 
      ...state.formState, 
      syllabus: state.formState.syllabus.filter((_, i) => i !== index) 
    } 
  })),
  
  updateSyllabusItem: (index, item) => set((state) => ({ 
    formState: { 
      ...state.formState, 
      syllabus: state.formState.syllabus.map((si, i) => i === index ? item : si) 
    } 
  })),
  
  addMaterial: (material) => set((state) => ({ 
    formState: { 
      ...state.formState, 
      materials: [...state.formState.materials, material] 
    } 
  })),
  
  removeMaterial: (index) => set((state) => ({ 
    formState: { 
      ...state.formState, 
      materials: state.formState.materials.filter((_, i) => i !== index) 
    } 
  })),
  
  reset: () => set({ formState: initialState }),
}));

// Re-export types for convenience
export * from './types';
export * from './store-actions';
