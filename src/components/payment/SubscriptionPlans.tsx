import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface SubscriptionPlan {
  name: string;
  price: number; // in paisa
  displayPrice: string;
  features: string[];
  popular?: boolean;
}

const plans: SubscriptionPlan[] = [
  {
    name: "Basic",
    price: 29900, // ₹299 in paisa
    displayPrice: "₹299",
    features: [
      "Access to basic courses",
      "Community support",
      "Monthly live sessions",
      "Basic progress tracking"
    ]
  },
  {
    name: "Premium", 
    price: 59900, // ₹599 in paisa
    displayPrice: "₹599",
    features: [
      "Access to all courses",
      "Priority support",
      "Weekly live sessions",
      "Advanced progress tracking",
      "Downloadable resources",
      "Certificate of completion"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: 99900, // ₹999 in paisa  
    displayPrice: "₹999",
    features: [
      "Everything in Premium",
      "1-on-1 mentoring sessions",
      "Custom learning paths",
      "API access",
      "Priority customer support",
      "Team management tools"
    ]
  }
];

const SubscriptionPlans = () => {
  const handleSubscribe = async (plan: SubscriptionPlan) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceAmount: plan.price,
          priceTier: plan.name,
          isSubscription: true
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      const errorMessage = error.message || "Failed to create checkout session";
      
      toast({
        title: "Subscription Error", 
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-muted-foreground">Select the perfect plan for your learning journey</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary' : ''}`}>
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-4xl font-bold text-primary">
                {plan.displayPrice}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => handleSubscribe(plan)}
                className="w-full mt-6"
                variant={plan.popular ? "default" : "outline"}
              >
                Subscribe to {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;