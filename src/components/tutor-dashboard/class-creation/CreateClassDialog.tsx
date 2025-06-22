
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import ClassTypeStep from "./steps/ClassTypeStep";
import DetailsStep from "./steps/DetailsStep";
import ScheduleStep from "./steps/ScheduleStep";
import PricingStep from "./steps/PricingStep";
import LocationStep from "./steps/LocationStep";
import CurriculumStep from "./steps/CurriculumStep";
import PreviewStep from "./steps/PreviewStep";
import { useClassCreationStore } from "@/hooks/use-class-creation-store";
import { autoFillClassCreation } from "@/testing/autoFill";
import ClassTypeSelector from "./ClassTypeSelector";
import { LectureType } from "@/types/lecture-types";
import { useFormStateManager } from "@/hooks/use-form-state-manager";
import { saveClass } from "@/services/class-creation-service";
import ClassCreationHeader from "./ClassCreationHeader";
import DialogActions from "./DialogActions";

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
}

const CreateClassDialog = ({ open, onOpenChange, onClassCreated }: CreateClassDialogProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { reset } = useClassCreationStore();
  const { formState } = useFormStateManager();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after dialog closes
    setTimeout(() => {
      setCurrentStep(0);
      reset();
    }, 300);
  };

  const handleJumpToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleSaveAsDraft = async () => {
    setIsPublishing(true);
    try {
      await saveClass(formState, 'draft');
      toast({
        title: "Saved as draft",
        description: "Your class has been saved as a draft.",
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
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await saveClass(formState, 'active');
      toast({
        title: "Class published!",
        description: "Your class is now live and students can enroll.",
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
  };

  const handleSelectClassType = async (selectedType: LectureType) => {
    toast({
      title: "Test Mode Activated",
      description: `Auto-filling ${selectedType} class creation form...`,
    });
    await autoFillClassCreation(selectedType, setCurrentStep, () => {});
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ClassTypeStep onNext={handleNext} />;
      case 1:
        return <DetailsStep onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <ScheduleStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <PricingStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <LocationStep onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <CurriculumStep onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <PreviewStep onBack={handleBack} onSaveAsDraft={handleSaveAsDraft} onPublish={handlePublish} />;
      default:
        return <ClassTypeStep onNext={handleNext} />;
    }
  };

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
          />
          
          <div className="overflow-y-auto max-h-[calc(90vh-150px)] px-6 py-4">
            {renderStep()}
          </div>
          
          {currentStep === 6 && (
            <DialogActions
              isPublishing={isPublishing}
              onSaveAsDraft={handleSaveAsDraft}
              onPublish={handlePublish}
            />
          )}
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
