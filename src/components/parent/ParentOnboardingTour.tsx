import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Calendar, Settings } from "lucide-react";

const ONBOARDING_STEPS = [
  {
    title: "Welcome to TalentSchool!",
    description: "As a parent, you can manage your children's learning journey all in one place. Let's get you started!",
    icon: Users,
  },
  {
    title: "Add Your Children",
    description: "Start by adding your children's profiles. You can add their age, interests, and grade level to get personalized class recommendations.",
    icon: Users,
    action: { label: "Add First Child", path: "/student/my-children" },
  },
  {
    title: "Explore Classes",
    description: "Browse thousands of live online classes for kids. Filter by age, subject, and schedule to find the perfect fit for each child.",
    icon: BookOpen,
    action: { label: "Browse Classes", path: "/student/explore" },
  },
  {
    title: "Track Progress",
    description: "Monitor all your children's classes, upcoming sessions, and progress from your dashboard. Stay involved in their learning journey!",
    icon: Calendar,
  },
  {
    title: "Manage Settings",
    description: "Set up notifications, billing preferences, and parental controls to customize your family's experience.",
    icon: Settings,
  },
];

const ParentOnboardingTour = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if this is first time and user is on a student route
    if (searchParams.get("firstTime") === "true") {
      setIsOpen(true);
      // Remove the firstTime parameter to prevent showing again
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("firstTime");
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleNext = () => {
    const step = ONBOARDING_STEPS[currentStep];
    
    if (step.action) {
      setIsOpen(false);
      navigate(step.action.path);
    } else if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = ONBOARDING_STEPS[currentStep];
  const Icon = step.icon;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center">{step.title}</DialogTitle>
          <DialogDescription className="text-center">
            {step.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center gap-2 py-4">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="w-full sm:w-auto"
          >
            Skip Tour
          </Button>
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="w-full sm:w-auto"
            >
              Previous
            </Button>
          )}
          <Button onClick={handleNext} className="w-full sm:w-auto">
            {step.action
              ? step.action.label
              : currentStep === ONBOARDING_STEPS.length - 1
              ? "Get Started"
              : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ParentOnboardingTour;