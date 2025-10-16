import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SpendingLimitCheck {
  canEnroll: boolean;
  limitExceeded: boolean;
  currentSpending: number;
  spendingLimit: number | null;
  remainingAmount: number;
}

export const useSpendingLimitCheck = (childId: string | null, classPrice: number) => {
  const { user } = useAuth();
  const [result, setResult] = useState<SpendingLimitCheck>({
    canEnroll: true,
    limitExceeded: false,
    currentSpending: 0,
    spendingLimit: null,
    remainingAmount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.id || !childId || user.role !== 'parent') {
      setResult({
        canEnroll: true,
        limitExceeded: false,
        currentSpending: 0,
        spendingLimit: null,
        remainingAmount: 0,
      });
      return;
    }

    const checkSpendingLimit = async () => {
      setIsLoading(true);
      try {
        // Get parent preferences with spending limit
        const { data: preferences, error: prefsError } = await supabase
          .from('parent_preferences')
          .select('spending_limit_per_child')
          .eq('parent_id', user.id)
          .maybeSingle();

        if (prefsError) throw prefsError;

        const spendingLimit = preferences?.spending_limit_per_child || null;

        // If no limit set, allow enrollment
        if (!spendingLimit) {
          setResult({
            canEnroll: true,
            limitExceeded: false,
            currentSpending: 0,
            spendingLimit: null,
            remainingAmount: 0,
          });
          setIsLoading(false);
          return;
        }

        // Calculate current spending for this child
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('student_enrollments')
          .select(`
            id,
            classes!inner(price)
          `)
          .eq('child_id', childId)
          .eq('enrolled_by_parent_id', user.id)
          .in('status', ['active', 'pending']);

        if (enrollmentsError) throw enrollmentsError;

        const currentSpending = enrollments?.reduce((sum, enrollment: any) => {
          return sum + (Number(enrollment.classes?.price) || 0);
        }, 0) || 0;

        const totalAfterEnrollment = currentSpending + classPrice;
        const canEnroll = totalAfterEnrollment <= Number(spendingLimit);
        const remainingAmount = Number(spendingLimit) - currentSpending;

        setResult({
          canEnroll,
          limitExceeded: !canEnroll,
          currentSpending,
          spendingLimit: Number(spendingLimit),
          remainingAmount: Math.max(0, remainingAmount),
        });
      } catch (error) {
        console.error('Error checking spending limit:', error);
        // On error, allow enrollment but log the issue
        setResult({
          canEnroll: true,
          limitExceeded: false,
          currentSpending: 0,
          spendingLimit: null,
          remainingAmount: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSpendingLimit();
  }, [user?.id, user?.role, childId, classPrice]);

  return {
    ...result,
    isLoading,
  };
};
