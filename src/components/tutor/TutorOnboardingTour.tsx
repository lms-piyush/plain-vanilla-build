import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  BookOpen, 
  User, 
  Wallet, 
  Sparkles 
} from 'lucide-react';

interface TutorOnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const onboardingSteps = [
  {
    title: 'Welcome to TalentSchool Tutors! 🎉',
    description: 'We\'re excited to have you join our community of passionate educators. Let us show you around!',
    icon: GraduationCap,
  },
  {
    title: 'Create Your First Class',
    description: 'Start by creating engaging classes for students. Choose from live sessions, recorded content, or in-person teaching.',
    icon: BookOpen,
    action: 'Go to Classes',
    route: '/tutor/classes',
  },
  {
    title: 'Set Up Your Profile',
    description: 'Complete your profile to build trust with students. Add your expertise, experience, and teaching philosophy.',
    icon: User,
    action: 'Edit Profile',
    route: '/tutor/profile',
  },
  {
    title: 'Configure Bank Account',
    description: 'Set up your bank account to receive payments for your classes. We use secure payment processing to ensure timely withdrawals.',
    icon: Wallet,
    action: 'Set Up Earnings',
    route: '/tutor/earnings',
  },
  {
    title: 'Start Teaching!',
    description: 'You\'re all set! Students can now find and enroll in your classes. Check your dashboard for enrollments and upcoming sessions.',
    icon: Sparkles,
    action: 'Go to Dashboard',
    route: '/tutor/dashboard',
  },
];

export const TutorOnboardingTour = ({ isOpen, onClose }: TutorOnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const handleAction = () => {
    const step = onboardingSteps[currentStep];
    if (step.route) {
      navigate(step.route);
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const currentStepData = onboardingSteps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <StepIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">{currentStepData.title}</DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Step {currentStep + 1} of {onboardingSteps.length}
              </p>
            </div>
          </div>
          <Progress value={progress} className="h-2 mt-4" />
        </DialogHeader>

        <DialogDescription className="py-4 text-base leading-relaxed">
          {currentStepData.description}
        </DialogDescription>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 sm:flex-none"
              >
                Back
              </Button>
            )}
            {currentStep < onboardingSteps.length - 1 && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="flex-1 sm:flex-none"
              >
                Skip Tour
              </Button>
            )}
          </div>

          <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
            {currentStepData.action && (
              <Button
                variant="outline"
                onClick={handleAction}
                className="flex-1 sm:flex-none"
              >
                {currentStepData.action}
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 sm:flex-none"
            >
              {currentStep < onboardingSteps.length - 1 ? 'Next' : 'Get Started'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
