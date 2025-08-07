import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { CreditCard } from "lucide-react";

interface PaymentButtonProps {
  amount: number; // in paisa
  description: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

const PaymentButton = ({ amount, description, className, variant = "default" }: PaymentButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount,
          description
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const displayAmount = `₹${(amount / 100).toFixed(0)}`;

  return (
    <Button 
      onClick={handlePayment}
      disabled={isLoading}
      variant={variant}
      className={className}
    >
      <CreditCard className="h-4 w-4 mr-2" />
      {isLoading ? "Processing..." : `Pay ${displayAmount}`}
    </Button>
  );
};

export default PaymentButton;