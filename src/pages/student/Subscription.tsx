import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, CreditCard, RefreshCw } from "lucide-react";
import { useSubscriptionStatus, useSubscriptionHistory, useCheckSubscription } from "@/hooks/use-subscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const Subscription = () => {
  const { data: subscriptionStatus, isLoading } = useSubscriptionStatus();
  const { data: subscriptionHistory } = useSubscriptionHistory();
  const checkSubscription = useCheckSubscription();

  const handleRefreshStatus = () => {
    checkSubscription.mutate();
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      window.open(data.url, '_blank');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to open customer portal. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-2 mb-6">
          <RefreshCw className="animate-spin h-4 w-4" />
          <span>Loading subscription status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
          <p className="text-muted-foreground">
            Manage your subscription plan and view payment history
          </p>
        </div>
        <Button
          onClick={handleRefreshStatus}
          disabled={checkSubscription.isPending}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${checkSubscription.isPending ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription>
            Your current subscription plan and status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <Badge variant={subscriptionStatus?.subscribed ? "default" : "secondary"}>
              {subscriptionStatus?.subscribed ? "Active" : "Inactive"}
            </Badge>
          </div>
          
          {subscriptionStatus?.subscription_tier && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Plan:</span>
              <Badge variant="outline">{subscriptionStatus.subscription_tier}</Badge>
            </div>
          )}
          
          {subscriptionStatus?.subscription_end && (
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="font-medium">Next renewal:</span>
              <span className="text-sm">
                {format(new Date(subscriptionStatus.subscription_end), "PPP")}
              </span>
            </div>
          )}

          {subscriptionStatus?.current_period_start && subscriptionStatus?.current_period_end && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-1">Current Billing Period</div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(subscriptionStatus.current_period_start), "MMM dd, yyyy")} - {format(new Date(subscriptionStatus.current_period_end), "MMM dd, yyyy")}
              </div>
            </div>
          )}

          {subscriptionStatus?.subscribed && (
            <Button onClick={handleManageSubscription} className="w-full sm:w-auto">
              Manage Subscription
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Subscription History */}
      {subscriptionHistory && subscriptionHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              Your subscription payment history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subscriptionHistory.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="font-medium">
                      ₹{(payment.amount / 100).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(payment.billing_period_start), "MMM dd")} - {format(new Date(payment.billing_period_end), "MMM dd, yyyy")}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={payment.status === 'paid' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'}
                    >
                      {payment.status}
                    </Badge>
                    {payment.paid_at && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Paid on {format(new Date(payment.paid_at), "MMM dd, yyyy")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Active Subscription */}
      {!subscriptionStatus?.subscribed && (
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              You don't have an active subscription plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to a plan to access premium classes and features.
            </p>
            <Button onClick={() => window.location.href = '/student/explore'}>
              Browse Classes
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Subscription;