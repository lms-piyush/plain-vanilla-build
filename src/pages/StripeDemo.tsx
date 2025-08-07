import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SubscriptionPlans from "@/components/payment/SubscriptionPlans";
import SubscriptionStatus from "@/components/payment/SubscriptionStatus";
import PaymentButton from "@/components/payment/PaymentButton";
import { Separator } from "@/components/ui/separator";

const StripeDemo = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Stripe Payment Integration</h1>
          <p className="text-muted-foreground text-lg">
            Complete payment solution with subscriptions and one-time payments in INR
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SubscriptionPlans />
          </div>
          <div className="space-y-6">
            <SubscriptionStatus />
            
            <Card>
              <CardHeader>
                <CardTitle>One-Time Payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <PaymentButton
                  amount={199900} // ₹1999
                  description="Premium Course Bundle"
                  className="w-full"
                />
                <PaymentButton
                  amount={49900} // ₹499
                  description="Individual Course"
                  variant="outline"
                  className="w-full"
                />
                <PaymentButton
                  amount={9900} // ₹99
                  description="Study Material"
                  variant="secondary"
                  className="w-full"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Implementation Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">✅ INR Currency</h3>
                <p className="text-muted-foreground">All payments in Indian Rupees</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">✅ Subscriptions</h3>
                <p className="text-muted-foreground">Monthly recurring billing</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">✅ One-time Payments</h3>
                <p className="text-muted-foreground">Course purchases</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">✅ Customer Portal</h3>
                <p className="text-muted-foreground">Manage subscriptions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeDemo;