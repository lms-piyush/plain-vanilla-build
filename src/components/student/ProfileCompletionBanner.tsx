import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';
import { useProfileCompletion } from '@/hooks/use-profile-completion';
import { useToast } from '@/hooks/use-toast';

export const ProfileCompletionBanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isComplete, missingFields, isDismissed, isLoading, dismissPrompt } = useProfileCompletion();

  // Don't show if complete, dismissed, or loading
  if (isLoading || isComplete || isDismissed) return null;

  const handleCompleteProfile = () => {
    navigate('/student/profile');
  };

  const handleDismiss = async () => {
    try {
      await dismissPrompt();
      toast({
        title: 'Dismissed',
        description: 'You can complete your profile anytime from the Profile page.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to dismiss notification. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getMissingFieldsText = () => {
    if (missingFields.length === 1) {
      return missingFields[0] === 'phone' ? 'phone number' : 'bio';
    }
    return 'phone number and bio';
  };

  return (
    <Alert className="mb-6 border-primary/50 bg-primary/5">
      <AlertCircle className="h-4 w-4 text-primary" />
      <AlertTitle className="text-primary">Complete Your Profile</AlertTitle>
      <AlertDescription className="mt-2 flex items-center justify-between">
        <span className="text-sm">
          Add your {getMissingFieldsText()} to help tutors understand you better and get personalized recommendations.
        </span>
        <div className="flex gap-2 ml-4">
          <Button
            size="sm"
            onClick={handleCompleteProfile}
            className="whitespace-nowrap"
          >
            Complete Profile
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
