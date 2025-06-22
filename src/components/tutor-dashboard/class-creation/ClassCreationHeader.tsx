
import { X, Play } from "lucide-react";
import { DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ClassCreationStepper from "./ClassCreationStepper";

interface ClassCreationHeaderProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
  onTestClick: () => void;
  onClose: () => void;
}

const ClassCreationHeader = ({ 
  steps, 
  currentStep, 
  onStepClick, 
  onTestClick, 
  onClose 
}: ClassCreationHeaderProps) => {
  return (
    <DialogHeader className="px-6 pt-6 pb-0">
      <div className="flex items-center justify-between">
        <DialogTitle className="text-xl font-semibold text-[#1F4E79]">Create New Class</DialogTitle>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={onTestClick}
                  variant="outline" 
                  size="sm"
                  className="gap-1 border-[#1F4E79]/20 bg-amber-50 text-amber-700 hover:bg-amber-100"
                >
                  <Play className="h-3.5 w-3.5" />
                  Test
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Auto-fill form for testing</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogClose asChild onClick={onClose}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </div>
      </div>
      <ClassCreationStepper 
        steps={steps}
        currentStep={currentStep}
        onStepClick={onStepClick}
      />
    </DialogHeader>
  );
};

export default ClassCreationHeader;
