import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileCompletionStatus {
  isComplete: boolean;
  missingFields: string[];
  isDismissed: boolean;
}

export const useProfileCompletion = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<ProfileCompletionStatus>({
    isComplete: true,
    missingFields: [],
    isDismissed: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchProfileStatus = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('phone, bio, dismissed_profile_prompt')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (profile) {
          const missingFields: string[] = [];
          
          if (!profile.phone) missingFields.push('phone');
          if (!profile.bio) missingFields.push('bio');

          setStatus({
            isComplete: missingFields.length === 0,
            missingFields,
            isDismissed: profile.dismissed_profile_prompt || false,
          });
        }
      } catch (error) {
        console.error('Error fetching profile completion status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileStatus();
  }, [user?.id]);

  const dismissPrompt = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ dismissed_profile_prompt: true })
        .eq('id', user.id);

      if (error) throw error;

      setStatus(prev => ({ ...prev, isDismissed: true }));
    } catch (error) {
      console.error('Error dismissing profile prompt:', error);
      throw error;
    }
  };

  return {
    ...status,
    isLoading,
    dismissPrompt,
  };
};
