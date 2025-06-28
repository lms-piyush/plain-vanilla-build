
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useClassCreationStore, FormState } from "@/hooks/use-class-creation-store";
import { autoFillClassCreation } from "@/testing/class-creation-auto-fill";
import { LectureType } from "@/types/lecture-types";
import { useFormStateManager } from "@/hooks/use-form-state-manager";
import { saveClass } from "@/services/class-creation-service";
import { TutorClass } from "@/hooks/use-tutor-classes";
import { useClassEditingLogic } from "./useClassEditingLogic";

export const useCreateClassDialog = (
  editingClass?: TutorClass | null,
  onClassCreated?: () => void,
  onClose?: () => void
) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();
  const { reset } = useClassCreationStore();
  const { updateFormState } = useFormStateManager();
  const { loadClassData } = useClassEditingLogic();

  // Load existing class data when editing
  useEffect(() => {
    if (editingClass && onClose) {
      loadClassData(editingClass);
    }
  }, [editingClass?.id, onClose, loadClassData]);

  const handleNext = useCallback(() => {
    setCurrentStep(prev => prev < 6 ? prev + 1 : prev);
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStep(prev => prev > 0 ? prev - 1 : prev);
  }, []);

  const handleJumpToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const transformFormState = useCallback((formState: any): FormState => {
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
  }, []);

  const handleSaveAsDraft = useCallback(async () => {
    setIsPublishing(true);
    try {
      const { formState } = useClassCreationStore.getState();
      const transformedFormState = transformFormState(formState);

      await saveClass(transformedFormState, 'draft', editingClass?.id);
      toast({
        title: editingClass ? "Class updated" : "Saved as draft",
        description: editingClass ? "Your class has been updated successfully." : "Your class has been saved as a draft.",
      });
      onClose?.();
      onClassCreated?.();
    } catch (error: any) {
      toast({
        title: "Error saving draft",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  }, [editingClass?.id, onClose, onClassCreated, toast, transformFormState]);

  const handlePublish = useCallback(async () => {
    setIsPublishing(true);
    try {
      const { formState } = useClassCreationStore.getState();
      const transformedFormState = transformFormState(formState);

      await saveClass(transformedFormState, 'active', editingClass?.id);
      toast({
        title: editingClass ? "Class updated and published!" : "Class published!",
        description: editingClass ? "Your class changes have been saved and published." : "Your class is now live and students can enroll.",
      });
      onClose?.();
      onClassCreated?.();
    } catch (error: any) {
      toast({
        title: "Error publishing class",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  }, [editingClass?.id, onClose, onClassCreated, toast, transformFormState]);

  const handleSelectClassType = useCallback(async (selectedType: LectureType) => {
    toast({
      title: "Test Mode Activated",
      description: `Auto-filling ${selectedType} class creation form...`,
    });
    await autoFillClassCreation(selectedType, setCurrentStep, updateFormState);
  }, [toast, updateFormState]);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    reset();
  }, [reset]);

  return {
    currentStep,
    typeSelectorOpen,
    isPublishing,
    setTypeSelectorOpen,
    handleNext,
    handleBack,
    handleJumpToStep,
    handleSaveAsDraft,
    handlePublish,
    handleSelectClassType,
    handleReset
  };
};
