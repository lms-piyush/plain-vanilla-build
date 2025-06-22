
import { useClassCreationStore } from "@/hooks/use-class-creation-store";

export const useFormStateManager = () => {
  const { 
    formState,
    setDeliveryMode,
    setClassFormat,
    setClassSize,
    setDurationType,
    setBasicDetails,
    setSchedule,
    setPricing,
    setLocation,
    setSyllabus
  } = useClassCreationStore();

  const updateFormState = (newState: any) => {
    // Helper function to update form state based on the current step
    if (newState.deliveryMode) setDeliveryMode(newState.deliveryMode);
    if (newState.classFormat) setClassFormat(newState.classFormat);
    if (newState.classSize) setClassSize(newState.classSize);
    if (newState.durationType) setDurationType(newState.durationType);
    
    if (newState.title || newState.subject || newState.description || newState.thumbnailUrl) {
      setBasicDetails({
        title: newState.title || formState.title,
        subject: newState.subject || formState.subject,
        description: newState.description || formState.description,
        thumbnailUrl: newState.thumbnailUrl || formState.thumbnailUrl
      });
    }
    
    if (newState.frequency || newState.startDate || newState.endDate || newState.totalSessions || newState.timeSlots) {
      setSchedule({
        frequency: newState.frequency || formState.frequency,
        startDate: newState.startDate || formState.startDate,
        endDate: newState.endDate || formState.endDate,
        totalSessions: newState.totalSessions || formState.totalSessions
      });
    }
    
    if (newState.price || newState.currency || newState.maxStudents !== undefined || newState.autoRenewal !== undefined) {
      setPricing({
        price: newState.price !== undefined ? newState.price : formState.price,
        currency: newState.currency || formState.currency,
        maxStudents: newState.maxStudents !== undefined ? newState.maxStudents : formState.maxStudents,
        autoRenewal: newState.autoRenewal !== undefined ? newState.autoRenewal : formState.autoRenewal
      });
    }
    
    if (newState.meetingLink || newState.address) {
      setLocation({
        meetingLink: newState.meetingLink || formState.meetingLink,
        address: newState.address || formState.address
      });
    }
    
    if (newState.syllabus) {
      setSyllabus(newState.syllabus);
    }
  };

  return { formState, updateFormState };
};
