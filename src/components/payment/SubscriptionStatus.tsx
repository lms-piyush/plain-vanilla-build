import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/use-subscription";
import { Calendar, CreditCard, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const SubscriptionStatus = () => {
  const { subscriptionStatus, isLoading, checkSubscription, openCustomerPortal } = useSubscription();

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to open customer portal",
        variant: "destructive"
      });
    }
  };

  const handleRefreshStatus = () => {
    checkSubscription();
    toast({
      title: "Refreshing...",
      description: "Checking your subscription status"
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading subscription status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Subscription Status</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshStatus}
            className="p-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Status:</span>
          <Badge variant={subscriptionStatus.subscribed ? "default" : "secondary"}>
            {subscriptionStatus.subscribed ? "Active" : "Inactive"}
          </Badge>
        </div>

        {subscriptionStatus.subscription_tier && (
          <div className="flex items-center justify-between">
            <span>Plan:</span>
            <Badge variant="outline">{subscriptionStatus.subscription_tier}</Badge>
          </div>
        )}

        {subscriptionStatus.subscription_end && (
          <div className="flex items-center justify-between">
            <span>Expires:</span>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(subscriptionStatus.subscription_end).toLocaleDateString()}
            </div>
          </div>
        )}

        {subscriptionStatus.subscribed && (
          <Button 
            onClick={handleManageSubscription}
            variant="outline"
            className="w-full"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Manage Subscription
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;