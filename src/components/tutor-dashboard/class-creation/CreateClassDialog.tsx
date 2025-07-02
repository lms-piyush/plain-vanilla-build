
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TutorClass } from '@/hooks/use-tutor-classes';
import { useCreateClassDialog } from './hooks/useCreateClassDialog';
import { useClassCreationStore } from '@/hooks/use-class-creation-store';
import CreateClassDialogContent from './CreateClassDialogContent';

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClassCreated: () => void;
  editingClass?: TutorClass | null;
  editMode?: 'full' | 'upload';
}

const CreateClassDialog = ({ 
  open, 
  onOpenChange, 
  onClassCreated, 
  editingClass,
  editMode = 'full'
}: CreateClassDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { formState, reset } = useClassCreationStore();
  
  const {
    handleSaveAsDraft,
    handlePublish,
    isPublishing,
  } = useCreateClassDialog(editingClass, onClassCreated, () => onOpenChange(false));

  // Set initial step based on edit mode - only run when dialog opens or editMode changes
  useEffect(() => {
    if (open) {
      if (editMode === 'upload') {
        setCurrentStep(3); // Start from Step 3 (Schedule) for upload mode
      } else if (!editingClass) {
        setCurrentStep(1); // Start from Step 1 for new classes
      }
    }
  }, [open, editMode]); // Removed editingClass from dependencies to prevent loops

  const handleClose = () => {
    if (!isPublishing) {
      onOpenChange(false);
      reset();
      setCurrentStep(1);
    }
  };

  // Determine if steps should be disabled based on edit mode
  const isStepDisabled = (step: number) => {
    if (editMode === 'upload') {
      return step < 3; // Disable steps 1 and 2 in upload mode
    }
    return false;
  };

  const canProceedToNext = () => {
    // Basic validation logic based on current step
    switch (currentStep) {
      case 1:
        return !!(formState.deliveryMode && formState.classFormat && formState.classSize && formState.durationType);
      case 2:
        return !!formState.title.trim();
      case 3:
        return formState.timeSlots.length > 0;
      case 4:
        return formState.price !== null || formState.price === 0; // Allow free classes
      case 5:
        return formState.deliveryMode === 'offline' || !!formState.meetingLink.trim();
      case 6:
        return formState.syllabus.length > 0;
      default:
        return true;
    }
  };

  const canGoBack = () => {
    if (editMode === 'upload') {
      return currentStep > 3; // Can't go back past step 3 in upload mode
    }
    return currentStep > 1;
  };

  const goToNextStep = () => {
    if (canProceedToNext() && currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (canGoBack()) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (!isStepDisabled(step)) {
      setCurrentStep(step);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-5xl h-[90vh] max-h-[800px] p-0 overflow-hidden">
        <div className="h-full p-6">
          <CreateClassDialogContent
            currentStep={currentStep}
            formData={formState}
            isSubmitting={isPublishing}
            onSubmit={handlePublish}
            onSaveAsDraft={handleSaveAsDraft}
            onClose={handleClose}
            canProceedToNext={canProceedToNext}
            canGoBack={canGoBack}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            goToStep={goToStep}
            isEditMode={!!editingClass}
            editMode={editMode}
            isStepDisabled={isStepDisabled}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassDialog;
