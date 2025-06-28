
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useClassCreationStore, FormState } from "@/hooks/use-class-creation-store";
import { autoFillClassCreation } from "@/testing/class-creation-auto-fill";
import ClassTypeSelector from "./ClassTypeSelector";
import { LectureType } from "@/types/lecture-types";
import { useFormStateManager } from "@/hooks/use-form-state-manager";
import { saveClass } from "@/services/class-creation-service";
import ClassCreationHeader from "./ClassCreationHeader";
import { TutorClass } from "@/hooks/use-tutor-classes";
import StepRenderer from "./StepRenderer";
import { useClassEditingLogic } from "./hooks/useClassEditingLogic";

const steps = [
  "Delivery & Type",
  "Details", 
  "Schedule",
  "Pricing & Capacity",
  "Location/Links",
  "Curriculum",
  "Preview & Publish"
];

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClassCreated?: () => void;
  editingClass?: TutorClass | null;
}

const CreateClassDialog = ({ open, onOpenChange, onClassCreated, editingClass }: CreateClassDialogProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { reset } = useClassCreationStore();
  const { updateFormState } = useFormStateManager();

  // Use custom hook for editing logic
  const { loadClassData } = useClassEditingLogic();

  // Load existing class data when editing - use useCallback to prevent infinite re-renders
  const handleLoadClassData = useCallback(() => {
    if (editingClass && open) {
      loadClassData(editingClass);
    }
  }, [editingClass?.id, open, loadClassData]); // Only depend on class ID, not the entire object

  useEffect(() => {
    handleLoadClassData();
  }, [handleLoadClassData]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    // Reset form after dialog closes
    setTimeout(() => {
      setCurrentStep(0);
      reset();
    }, 300);
  }, [onOpenChange, reset]);

  const handleJumpToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const handleSaveAsDraft = useCallback(async () => {
    setIsPublishing(true);
    try {
      const { formState } = useClassCreationStore.getState();
      
      const transformedFormState: FormState = {
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

      await saveClass(transformedFormState, 'draft', editingClass?.id);
      toast({
        title: editingClass ? "Class updated" : "Saved as draft",
        description: editingClass ? "Your class has been updated successfully." : "Your class has been saved as a draft.",
      });
      handleClose();
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
  }, [editingClass?.id, handleClose, onClassCreated, toast]);

  const handlePublish = useCallback(async () => {
    setIsPublishing(true);
    try {
      const { formState } = useClassCreationStore.getState();
      
      const transformedFormState: FormState = {
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

      await saveClass(transformedFormState, 'active', editingClass?.id);
      toast({
        title: editingClass ? "Class updated and published!" : "Class published!",
        description: editingClass ? "Your class changes have been saved and published." : "Your class is now live and students can enroll.",
      });
      handleClose();
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
  }, [editingClass?.id, handleClose, onClassCreated, toast]);

  const handleSelectClassType = useCallback(async (selectedType: LectureType) => {
    toast({
      title: "Test Mode Activated",
      description: `Auto-filling ${selectedType} class creation form...`,
    });
    await autoFillClassCreation(selectedType, setCurrentStep, updateFormState);
  }, [toast, updateFormState]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden max-h-[90vh]">
          <ClassCreationHeader
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleJumpToStep}
            onTestClick={() => setTypeSelectorOpen(true)}
            onClose={handleClose}
            editingClass={editingClass}
          />
          
          <div className="overflow-y-auto max-h-[calc(90vh-150px)] px-6 py-4">
            <StepRenderer
              currentStep={currentStep}
              onNext={handleNext}
              onBack={handleBack}
              onSaveAsDraft={handleSaveAsDraft}
              onPublish={handlePublish}
              isPublishing={isPublishing}
              editingClass={!!editingClass}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      <ClassTypeSelector 
        open={typeSelectorOpen}
        onClose={() => setTypeSelectorOpen(false)}
        onSelectType={handleSelectClassType}
      />
    </>
  );
};

export default CreateClassDialog;
