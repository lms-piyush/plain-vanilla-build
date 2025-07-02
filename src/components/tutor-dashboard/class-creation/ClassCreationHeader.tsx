
import { X, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClassCreationStepper from "./ClassCreationStepper";
import { TutorClass } from "@/hooks/use-tutor-classes";

interface ClassCreationHeaderProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
  onTestClick: () => void;
  onClose: () => void;
  editingClass?: TutorClass | null;
}

const ClassCreationHeader = ({ 
  steps, 
  currentStep, 
  onStepClick, 
  onTestClick, 
  onClose,
  editingClass
}: ClassCreationHeaderProps) => {
  return (
    <div className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-[#1F4E79]">
            {editingClass ? 'Edit Class' : 'Create New Class'}
          </h2>
          {editingClass && (
            <p className="text-sm text-gray-600 mt-1">
              Editing: {editingClass.title}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!editingClass && (
            <Button
              variant="outline"
              size="sm"
              onClick={onTestClick}
              className="flex items-center gap-2 text-xs"
            >
              <TestTube className="h-3 w-3" />
              Test Auto-Fill
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ClassCreationStepper
        currentStep={currentStep}
        onStepClick={onStepClick}
      />
    </div>
  );
};

export default ClassCreationHeader;
