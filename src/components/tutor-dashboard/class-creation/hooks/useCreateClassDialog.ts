
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useClassCreationStore } from "@/hooks/use-class-creation-store";
import { autoFillClassCreation } from "@/testing/class-creation-auto-fill";
import { LectureType } from "@/types/lecture-types";
import { useFormStateManager } from "@/hooks/use-form-state-manager";
import { saveClass } from "@/services/class-creation-service";
import { TutorClass } from "@/hooks/use-tutor-classes";
import { useClassEditingLogic } from "./useClassEditingLogic";

export const useCreateClassDialog = (
  onOpenChange: (open: boolean) => void,
  editingClass?: any,
  editMode?: 'full' | 'upload'
) => {
  const store = useClassCreationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { updateFormState } = useFormStateManager();
  const { loadClassData } = useClassEditingLogic();

  // Load existing class data when editing
  const [hasLoadedClass, setHasLoadedClass] = useState(false);
  
  useEffect(() => {
    if (editingClass && !hasLoadedClass) {
      loadClassData(editingClass);
      setHasLoadedClass(true);
    } else if (!editingClass && hasLoadedClass) {
      setHasLoadedClass(false);
    }
  }, [editingClass?.id, hasLoadedClass, loadClassData]);

  const goToNextStep = useCallback(() => {
    store.nextStep();
  }, [store]);

  const goToPreviousStep = useCallback(() => {
    store.previousStep();
  }, [store]);

  const goToStep = useCallback((step: number) => {
    store.goToStep(step);
  }, [store]);

  const canProceedToNext = useCallback(() => {
    // Add validation logic here based on current step
    return true;
  }, []);

  const canGoBack = useCallback(() => {
    return store.currentStep > 1;
  }, [store.currentStep]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Transform store state to match expected format
      const formData = {
        deliveryMode: store.deliveryMode,
        classFormat: store.classFormat,
        classSize: store.classSize,
        durationType: store.durationType,
        basicDetails: {
          title: store.title,
          subject: store.subject,
          description: store.description,
          thumbnailUrl: store.thumbnailUrl,
        },
        schedule: {
          frequency: store.frequency,
          startDate: store.startDate,
          endDate: store.endDate,
          enrollmentDeadline: store.enrollmentDeadline,
          totalSessions: store.totalSessions,
        },
        timeSlots: store.timeSlots,
        pricing: {
          price: store.price,
          currency: store.currency,
          maxStudents: store.maxStudents,
          autoRenewal: store.autoRenewal,
        },
        location: {
          meetingLink: store.meetingLink,
          address: store.address,
        },
        syllabus: store.syllabus,
        materials: store.materials,
      };

      await saveClass(formData, 'active', editingClass?.id);
      toast({
        title: editingClass ? "Class updated and published!" : "Class published!",
        description: editingClass ? "Your class changes have been saved and published." : "Your class is now live and students can enroll.",
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error publishing class",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [store, editingClass?.id, onOpenChange, toast]);

  const handleSaveAsDraft = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const formData = {
        deliveryMode: store.deliveryMode,
        classFormat: store.classFormat,
        classSize: store.classSize,
        durationType: store.durationType,
        basicDetails: {
          title: store.title,
          subject: store.subject,
          description: store.description,
          thumbnailUrl: store.thumbnailUrl,
        },
        schedule: {
          frequency: store.frequency,
          startDate: store.startDate,
          endDate: store.endDate,
          enrollmentDeadline: store.enrollmentDeadline,
          totalSessions: store.totalSessions,
        },
        timeSlots: store.timeSlots,
        pricing: {
          price: store.price,
          currency: store.currency,
          maxStudents: store.maxStudents,
          autoRenewal: store.autoRenewal,
        },
        location: {
          meetingLink: store.meetingLink,
          address: store.address,
        },
        syllabus: store.syllabus,
        materials: store.materials,
      };

      await saveClass(formData, 'draft', editingClass?.id);
      toast({
        title: editingClass ? "Class updated" : "Saved as draft",
        description: editingClass ? "Your class has been updated successfully." : "Your class has been saved as a draft.",
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error saving draft",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [store, editingClass?.id, onOpenChange, toast]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const isStepDisabled = useCallback((step: number) => {
    // Add logic to disable steps based on requirements
    return false;
  }, []);

  return {
    currentStep: store.currentStep,
    formData: store,
    isSubmitting,
    canProceedToNext,
    canGoBack,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    handleSubmit,
    handleSaveAsDraft,
    handleClose,
    isStepDisabled,
  };
};
