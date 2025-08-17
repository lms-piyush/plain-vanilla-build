import React from "react";
import { Button } from "@/components/ui/button";
import { useCreateSubscriptionCheckout, SubscriptionPlan } from "@/hooks/use-subscription";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionButtonProps {
  plan: SubscriptionPlan;
  classId?: string;
  classCount?: number;
  className?: string;
  disabled?: boolean;
}

const SubscriptionButton = ({ plan, classId, classCount = 1, className, disabled }: SubscriptionButtonProps) => {
  const createCheckout = useCreateSubscriptionCheckout();

  const handleSubscribe = async () => {
    // Fetch the latest stripe_price_id from DB to avoid stale cached values
    let priceId = plan.stripe_price_id;
    try {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("stripe_price_id")
        .eq("id", plan.id)
        .single();
      if (!error && data?.stripe_price_id) {
        priceId = data.stripe_price_id;
      }
    } catch (_) {
      // silently fall back to prop value
    }

    createCheckout.mutate({
      priceId,
      classId,
      classCount,
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