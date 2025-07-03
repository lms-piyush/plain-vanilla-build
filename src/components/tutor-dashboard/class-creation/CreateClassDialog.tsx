
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCreateClassDialog } from './hooks/useCreateClassDialog';
import CreateClassDialogContent from './CreateClassDialogContent';
import ClassDataLoader from './ClassDataLoader';

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingClass?: any;
  editMode?: 'full' | 'upload';
  onClassCreated?: () => void;
}

const CreateClassDialog = ({ 
  open, 
  onOpenChange, 
  editingClass,
  editMode = 'full',
  onClassCreated
}: CreateClassDialogProps) => {
  const {
    currentStep,
    formData,
    isSubmitting,
    canProceedToNext,
    canGoBack,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    handleSubmit,
    handleSaveAsDraft,
    handleClose,
    isStepDisabled
  } = useCreateClassDialog(onOpenChange, editingClass, editMode, onClassCreated);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-5xl max-h-[90vh] p-0 overflow-hidden">
        <ClassDataLoader classId={editingClass?.id}>
          <div className="p-6 h-full">
            <CreateClassDialogContent
              currentStep={currentStep}
              formData={formData}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
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
        </ClassDataLoader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassDialog;
