
import React from 'react';
import { ClassCreationFormData } from '@/hooks/use-class-creation-store/types';
import ClassCreationStepper from './ClassCreationStepper';
import StepRenderer from './StepRenderer';
import DialogActions from './DialogActions';

interface CreateClassDialogContentProps {
  currentStep: number;
  formData: ClassCreationFormData;
  setFormData: (data: Partial<ClassCreationFormData>) => void;
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
  onClose: () => void;
  canProceedToNext: () => boolean;
  canGoBack: () => boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  isEditMode: boolean;
  editMode?: 'full' | 'upload';
  isStepDisabled?: (step: number) => boolean;
}

const CreateClassDialogContent = ({
  currentStep,
  formData,
  setFormData,
  isSubmitting,
  onSubmit,
  onClose,
  canProceedToNext,
  canGoBack,
  goToNextStep,
  goToPreviousStep,
  goToStep,
  isEditMode,
  editMode = 'full',
  isStepDisabled,
}: CreateClassDialogContentProps) => {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">
          {editMode === 'upload' 
            ? 'Upload Class Content' 
            : isEditMode 
            ? 'Edit Class' 
            : 'Create New Class'
          }
        </h2>
        {editMode === 'upload' && (
          <p className="text-sm text-gray-600 mt-1">
            Update schedules and content for your completed class
          </p>
        )}
      </div>

      <ClassCreationStepper 
        currentStep={currentStep} 
        onStepClick={goToStep}
        isStepDisabled={isStepDisabled}
        editMode={editMode}
      />

      <div className="min-h-[400px]">
        <StepRenderer
          currentStep={currentStep}
          formData={formData}
          setFormData={setFormData}
          editMode={editMode}
        />
      </div>

      <DialogActions
        currentStep={currentStep}
        canGoBack={canGoBack}
        canProceedToNext={canProceedToNext}
        isSubmitting={isSubmitting}
        onBack={goToPreviousStep}
        onNext={goToNextStep}
        onSubmit={onSubmit}
        onClose={onClose}
        isEditMode={isEditMode}
        editMode={editMode}
      />
    </div>
  );
};

export default CreateClassDialogContent;
