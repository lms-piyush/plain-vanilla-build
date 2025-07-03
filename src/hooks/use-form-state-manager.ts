
import { useClassCreationStore } from "@/hooks/use-class-creation-store";

export const useFormStateManager = () => {
  const store = useClassCreationStore();

  const updateFormState = (newState: any) => {
    // Helper function to update form state based on the current step
    if (newState.deliveryMode) store.setDeliveryMode(newState.deliveryMode);
    if (newState.classFormat) store.setClassFormat(newState.classFormat);
    if (newState.classSize) store.setClassSize(newState.classSize);
    if (newState.durationType) store.setDurationType(newState.durationType);
    
    if (newState.title || newState.subject || newState.description || newState.thumbnailUrl) {
      store.setBasicDetails({
        title: newState.title || store.title,
        subject: newState.subject || store.subject,
        description: newState.description || store.description,
        thumbnailUrl: newState.thumbnailUrl || store.thumbnailUrl
      });
    }
    
    if (newState.frequency || newState.startDate || newState.endDate || newState.enrollmentDeadline || newState.totalSessions || newState.timeSlots) {
      store.setSchedule({
        frequency: newState.frequency || store.frequency,
        startDate: newState.startDate || store.startDate,
        endDate: newState.endDate || store.endDate,
        enrollmentDeadline: newState.enrollmentDeadline || store.enrollmentDeadline,
        totalSessions: newState.totalSessions || store.totalSessions
      });
    }
    
    if (newState.price || newState.currency || newState.maxStudents !== undefined || newState.autoRenewal !== undefined) {
      store.setPricing({
        price: newState.price !== undefined ? newState.price : store.price,
        currency: newState.currency || store.currency,
        maxStudents: newState.maxStudents !== undefined ? newState.maxStudents : store.maxStudents,
        autoRenewal: newState.autoRenewal !== undefined ? newState.autoRenewal : store.autoRenewal
      });
    }
    
    if (newState.meetingLink || newState.address) {
      store.setLocation({
        meetingLink: newState.meetingLink || store.meetingLink,
        address: newState.address || store.address
      });
    }
    
    if (newState.syllabus) {
      store.setSyllabus(newState.syllabus);
    }
  };

  return { formState: store, updateFormState };
};
