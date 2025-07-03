
import { ClassCreationState } from '@/hooks/use-class-creation-store';

export const transformToLegacyFormState = (state: ClassCreationState) => {
  // Since we're using a flat structure now, just return the state as-is
  return state;
};

export const transformFromLegacyFormState = (formState: any): ClassCreationState => {
  // Since we're using a flat structure now, just return the formState as-is
  return formState;
};
