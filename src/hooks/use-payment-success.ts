import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePaymentSuccess = (onSuccess?: () => void) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get('payment');
    const sessionId = params.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      handlePaymentSuccess(sessionId);
    } else if (paymentStatus === 'cancelled') {
      toast({
        title: "Payment cancelled",
        description: "Your payment was cancelled. You can try again anytime.",
        variant: "destructive"
      });
      // Clear URL parameters
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handlePaymentSuccess = async (sessionId: string) => {
    try {
      console.log('Processing payment success for session:', sessionId);
      
      const { data, error } = await supabase.functions.invoke('process-payment-enrollment', {
        body: { sessionId }
      });

      if (error) {
        console.error('Error processing payment enrollment:', error);
        toast({
          title: "Payment processed, but enrollment failed",
          description: "Please contact support for assistance.",
          variant: "destructive"
        });
        return;
      }

      if (data?.success) {
        toast({
          title: "Payment successful!",
          description: "You have been enrolled in the class. Welcome aboard!",
        });
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error('Error in payment success handler:', error);
      toast({
        title: "Payment processed",
        description: "There may have been an issue with enrollment. Please check your enrolled classes.",
        variant: "destructive"
      });
    } finally {
      // Clear URL parameters
      navigate(location.pathname, { replace: true });
    }
  };
};