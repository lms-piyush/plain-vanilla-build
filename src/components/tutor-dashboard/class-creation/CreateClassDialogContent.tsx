
import React from 'react';
import { ClassCreationState } from '@/hooks/use-class-creation-store/types';
import ClassCreationStepper from './ClassCreationStepper';
import StepRenderer from './StepRenderer';
import DialogActions from './DialogActions';

interface CreateClassDialogContentProps {
  currentStep: number;
  formData: ClassCreationState;
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
  onSaveAsDraft: () => Promise<void>;
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
  isSubmitting,
  onSubmit,
  onSaveAsDraft,
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
    <div className="flex flex-col h-full max-h-[90vh]">
      {/* Header */}
      <div className="flex-shrink-0 border-b pb-4 px-1">
        <h2 className="text-xl md:text-2xl font-bold text-center md:text-left">
          {editMode === 'upload' 
            ? 'Upload Class Content' 
            : isEditMode 
            ? 'Edit Class' 
            : 'Create New Class'
          }
        </h2>
        {editMode === 'upload' && (
          <p className="text-sm text-gray-600 mt-1 text-center md:text-left">
            Update schedules and content for your completed class
          </p>
        )}
      </div>

      {/* Stepper */}
      <div className="flex-shrink-0 py-4 md:py-6">
        <ClassCreationStepper 
          currentStep={currentStep} 
          onStepClick={goToStep}
          isStepDisabled={isStepDisabled}
          editMode={editMode}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-[400px] px-1">
          <StepRenderer
            currentStep={currentStep}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            onSaveAsDraft={onSaveAsDraft}
            onPublish={onSubmit}
            isPublishing={isSubmitting}
            editingClass={isEditMode}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 border-t pt-4 px-1">
        <DialogActions
          isPublishing={isSubmitting}
          onSaveAsDraft={onSaveAsDraft}
          onPublish={onSubmit}
        />
      </div>
    </div>
  );
};

export default CreateClassDialogContent;
