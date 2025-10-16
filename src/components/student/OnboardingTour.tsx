import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Star, MessageSquare } from "lucide-react";

const OnboardingTour = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const firstTime = searchParams.get("firstTime");
    if (firstTime === "true") {
      setIsOpen(true);
      // Remove the parameter after showing
      searchParams.delete("firstTime");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const steps = [
    {
      title: "Welcome to Your Learning Journey! 🎉",
      description: "Let's show you around so you can get started quickly.",
      icon: <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />,
    },
    {
      title: "Explore Classes",
      description: "Browse hundreds of classes across various subjects. Use filters to find exactly what you're looking for, and save classes you're interested in.",
      icon: <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />,
    },
    {
      title: "Track Your Progress",
      description: "View your enrolled classes, upcoming sessions, and track your learning progress all in one place.",
      icon: <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />,
    },
    {
      title: "Connect with Tutors",
      description: "Message your tutors directly, leave reviews, and get the support you need to succeed.",
      icon: <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />,
    },
    {
      title: "Ready to Start?",
      description: "You're all set! Start exploring classes and begin your learning journey today.",
      icon: <Star className="h-12 w-12 text-primary mx-auto mb-4" />,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep(0);
  };

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">{currentStepData.title}</DialogTitle>
          <DialogDescription className="text-center pt-4">
            {currentStepData.icon}
            <p className="text-base">{currentStepData.description}</p>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-between">
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            Step {currentStep + 1} of {steps.length}
          </div>
          
          <div className="flex gap-2 justify-center sm:justify-end">
            {currentStep < steps.length - 1 && (
              <Button variant="ghost" onClick={handleSkip}>
                Skip Tour
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep < steps.length - 1 ? "Next" : "Get Started"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTour;