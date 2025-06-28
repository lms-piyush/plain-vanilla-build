
import { FormState, ClassCreationState } from "@/hooks/use-class-creation-store";

export const transformFormState = (formState: ClassCreationState): FormState => {
  return {
    deliveryMode: formState.deliveryMode,
    classFormat: formState.classFormat,
    classSize: formState.classSize,
    durationType: formState.durationType,
    basicDetails: {
      title: formState.title,
      subject: formState.subject,
      description: formState.description,
      thumbnailUrl: formState.thumbnailUrl,
    },
    schedule: {
      frequency: formState.frequency,
      startDate: formState.startDate,
      endDate: formState.endDate,
      enrollmentDeadline: formState.enrollmentDeadline,
      totalSessions: formState.totalSessions,
    },
    timeSlots: formState.timeSlots,
    pricing: {
      price: formState.price,
      currency: formState.currency,
      maxStudents: formState.maxStudents,
      autoRenewal: formState.autoRenewal,
    },
    location: {
      meetingLink: formState.meetingLink,
      address: formState.address,
    },
    syllabus: formState.syllabus,
    materials: formState.materials,
  };
};
