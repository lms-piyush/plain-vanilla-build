
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TutorClass } from '@/hooks/use-tutor-classes';
import { useCreateClassDialog } from './hooks/useCreateClassDialog';
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
  const {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    isSubmitting,
    resetForm,
    handleSubmit,
    canProceedToNext,
    canGoBack,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isEditMode,
  } = useCreateClassDialog({
    onClassCreated,
    onClose: () => onOpenChange(false),
    editingClass,
  });

  // Set initial step based on edit mode
  useEffect(() => {
    if (open && editMode === 'upload') {
      // Start from Step 3 (Schedule) for upload mode
      setCurrentStep(3);
    } else if (open && !editingClass) {
      // Start from Step 1 for new classes
      setCurrentStep(1);
    }
  }, [open, editMode, editingClass, setCurrentStep]);

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      resetForm();
    }
  };

  // Determine if steps should be disabled based on edit mode
  const isStepDisabled = (step: number) => {
    if (editMode === 'upload') {
      return step < 3; // Disable steps 1 and 2 in upload mode
    }
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <CreateClassDialogContent
          currentStep={currentStep}
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onClose={handleClose}
          canProceedToNext={canProceedToNext}
          canGoBack={canGoBack}
          goToNextStep={goToNextStep}
          goToPreviousStep={goToPreviousStep}
          goToStep={goToStep}
          isEditMode={isEditMode}
          editMode={editMode}
          isStepDisabled={isStepDisabled}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassDialog;
