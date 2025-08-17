import React from "react";
import { Button } from "@/components/ui/button";
import { useCreateSubscriptionCheckout, SubscriptionPlan } from "@/hooks/use-subscription";

interface SubscriptionButtonProps {
  plan: SubscriptionPlan;
  classId?: string;
  className?: string;
  disabled?: boolean;
}

const SubscriptionButton = ({ plan, classId, className, disabled }: SubscriptionButtonProps) => {
  const createCheckout = useCreateSubscriptionCheckout();

  const handleSubscribe = () => {
    createCheckout.mutate({
      priceId: plan.stripe_price_id,
      classId,
    });
  };

  return (
    <Button
      onClick={handleSubscribe}
      disabled={disabled || createCheckout.isPending}
      className={className}
    >
      {createCheckout.isPending ? "Processing..." : `Subscribe to ${plan.name}`}
    </Button>
  );
};

export default SubscriptionButton;