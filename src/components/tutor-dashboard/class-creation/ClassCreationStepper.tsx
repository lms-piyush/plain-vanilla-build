
import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface ClassCreationStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  isStepDisabled?: (step: number) => boolean;
  editMode?: 'full' | 'upload';
}

const ClassCreationStepper = ({ 
  currentStep, 
  onStepClick, 
  isStepDisabled,
  editMode = 'full' 
}: ClassCreationStepperProps) => {
  const steps: Step[] = [
    { number: 1, title: 'Delivery & Type', description: 'Choose class delivery mode and format' },
    { number: 2, title: 'Details', description: 'Add class title, description, and pricing' },
    { number: 3, title: 'Schedule', description: 'Set up class timing and duration' },
    { number: 4, title: 'Location', description: 'Add location or meeting details' },
    { number: 5, title: 'Curriculum', description: 'Create lessons and learning objectives' },
    { number: 6, title: 'Preview', description: 'Review and publish your class' },
  ];

  const getStepStatus = (stepNumber: number) => {
    const disabled = isStepDisabled?.(stepNumber) || false;
    
    if (disabled) {
      return 'disabled';
    } else if (stepNumber < currentStep) {
      return 'completed';
    } else if (stepNumber === currentStep) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-primary text-white border-primary';
      case 'current':
        return 'bg-primary text-white border-primary ring-4 ring-primary/20';
      case 'disabled':
        return 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed';
      default:
        return 'bg-white text-gray-400 border-gray-300 hover:border-gray-400';
    }
  };

  const handleStepClick = (stepNumber: number) => {
    const status = getStepStatus(stepNumber);
    if (status !== 'disabled') {
      onStepClick(stepNumber);
    }
  };

  return (
    <div className="w-full px-4">
      {/* Mobile View - Horizontal Scrollable */}
      <div className="md:hidden">
        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const status = getStepStatus(step.number);
            const isLast = index === steps.length - 1;
            
            return (
              <div key={step.number} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleStepClick(step.number)}
                    disabled={status === 'disabled'}
                    className={`
                      flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-medium transition-all
                      ${getStepClasses(status)}
                      ${status !== 'disabled' ? 'cursor-pointer' : ''}
                    `}
                  >
                    {status === 'completed' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.number
                    )}
                  </button>
                  <div className="mt-1 text-center">
                    <p className={`text-xs font-medium whitespace-nowrap ${
                      status === 'disabled' ? 'text-gray-400' : 
                      status === 'current' ? 'text-primary' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                
                {!isLast && (
                  <div className={`w-8 h-0.5 mx-2 flex-shrink-0 ${
                    step.number < currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop View - Centered */}
      <div className="hidden md:flex items-center justify-center">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step.number);
            const isLast = index === steps.length - 1;
            
            return (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleStepClick(step.number)}
                    disabled={status === 'disabled'}
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-medium transition-all
                      ${getStepClasses(status)}
                      ${status !== 'disabled' ? 'cursor-pointer' : ''}
                    `}
                  >
                    {status === 'completed' ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </button>
                  <div className="mt-2 text-center max-w-[100px]">
                    <p className={`text-sm font-medium ${
                      status === 'disabled' ? 'text-gray-400' : 
                      status === 'current' ? 'text-primary' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </p>
                    {editMode === 'upload' && status === 'disabled' && (
                      <p className="text-xs text-gray-400 mt-1">Locked</p>
                    )}
                  </div>
                </div>
                
                {!isLast && (
                  <div className={`w-12 h-0.5 mx-3 ${
                    step.number < currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClassCreationStepper;
