
import { create } from 'zustand';
import { ClassCreationStore } from './types';
import { initialState } from './initial-state';
import { createStoreActions } from './store-actions';

export const useClassCreationStore = create<ClassCreationStore>((set, get) => ({
  ...initialState,
  ...createStoreActions(set, get),
}));

// Re-export types for convenience
export * from './types';
