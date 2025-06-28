
import { useCallback } from "react";
import ClassTypeSelector from "./ClassTypeSelector";
import CreateClassDialogContent from "./CreateClassDialogContent";
import { TutorClass } from "@/hooks/use-tutor-classes";
import { useCreateClassDialog } from "./hooks/useCreateClassDialog";

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClassCreated?: () => void;
  editingClass?: TutorClass | null;
}

const CreateClassDialog = ({ open, onOpenChange, onClassCreated, editingClass }: CreateClassDialogProps) => {
  const handleClose = useCallback(() => {
    onOpenChange(false);
    // Reset form after dialog closes
    setTimeout(() => {
      handleReset();
    }, 300);
  }, [onOpenChange]);

  const {
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
  } = useCreateClassDialog(editingClass, onClassCreated, handleClose);

  return (
    <>
      <CreateClassDialogContent
        open={open}
        onOpenChange={onOpenChange}
        currentStep={currentStep}
        onStepClick={handleJumpToStep}
        onTestClick={() => setTypeSelectorOpen(true)}
        onClose={handleClose}
        onNext={handleNext}
        onBack={handleBack}
        onSaveAsDraft={handleSaveAsDraft}
        onPublish={handlePublish}
        isPublishing={isPublishing}
        editingClass={editingClass}
      />
      
      <ClassTypeSelector 
        open={typeSelectorOpen}
        onClose={() => setTypeSelectorOpen(false)}
        onSelectType={handleSelectClassType}
      />
    </>
  );
};

export default CreateClassDialog;
