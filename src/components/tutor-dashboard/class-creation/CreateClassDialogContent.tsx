
import { 
  Dialog, 
  DialogContent
} from "@/components/ui/dialog";
import ClassCreationHeader from "./ClassCreationHeader";
import StepRenderer from "./StepRenderer";
import { TutorClass } from "@/hooks/use-tutor-classes";

const steps = [
  "Delivery & Type",
  "Details", 
  "Schedule",
  "Pricing & Capacity",
  "Location/Links",
  "Curriculum",
  "Preview & Publish"
];

interface CreateClassDialogContentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStep: number;
  onStepClick: (step: number) => void;
  onTestClick: () => void;
  onClose: () => void;
  onNext: () => void;
  onBack: () => void;
  onSaveAsDraft: () => void;
  onPublish: () => void;
  isPublishing: boolean;
  editingClass?: TutorClass | null;
}

const CreateClassDialogContent = ({
  open,
  onOpenChange,
  currentStep,
  onStepClick,
  onTestClick,
  onClose,
  onNext,
  onBack,
  onSaveAsDraft,
  onPublish,
  isPublishing,
  editingClass
}: CreateClassDialogContentProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden max-h-[90vh]">
        <ClassCreationHeader
          steps={steps}
          currentStep={currentStep}
          onStepClick={onStepClick}
          onTestClick={onTestClick}
          onClose={onClose}
          editingClass={editingClass}
        />
        
        <div className="overflow-y-auto max-h-[calc(90vh-150px)] px-6 py-4">
          <StepRenderer
            currentStep={currentStep}
            onNext={onNext}
            onBack={onBack}
            onSaveAsDraft={onSaveAsDraft}
            onPublish={onPublish}
            isPublishing={isPublishing}
            editingClass={!!editingClass}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassDialogContent;
