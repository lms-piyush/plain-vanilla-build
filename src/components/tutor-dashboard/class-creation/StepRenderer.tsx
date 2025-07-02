
import ClassTypeStep from "./steps/ClassTypeStep";
import DetailsStep from "./steps/DetailsStep";
import ScheduleStep from "./steps/ScheduleStep";
import PricingStep from "./steps/PricingStep";
import LocationStep from "./steps/LocationStep";
import CurriculumStep from "./steps/CurriculumStep";
import PreviewStep from "./steps/PreviewStep";

interface StepRendererProps {
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  onSaveAsDraft: () => void;
  onPublish: () => void;
  isPublishing: boolean;
  editingClass: boolean;
}

const StepRenderer = ({
  currentStep,
  onNext,
  onBack,
  onSaveAsDraft,
  onPublish,
  isPublishing,
  editingClass
}: StepRendererProps) => {
  switch (currentStep) {
    case 1:
      return <ClassTypeStep onNext={onNext} />;
    case 2:
      return <DetailsStep onNext={onNext} onBack={onBack} />;
    case 3:
      return <ScheduleStep onNext={onNext} onBack={onBack} />;
    case 4:
      return <PricingStep onNext={onNext} onBack={onBack} />;
    case 5:
      return <LocationStep onNext={onNext} onBack={onBack} />;
    case 6:
      return <CurriculumStep onNext={onNext} onBack={onBack} />;
    case 7:
      return (
        <PreviewStep 
          onBack={onBack} 
          onSaveAsDraft={onSaveAsDraft} 
          onPublish={onPublish}
          isPublishing={isPublishing}
          editingClass={editingClass}
        />
      );
    default:
      return <ClassTypeStep onNext={onNext} />;
  }
};

export default StepRenderer;
