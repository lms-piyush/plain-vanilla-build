import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, CheckCircle, AlertCircle, Settings } from "lucide-react";

const StripeSetupGuide = () => {
  const setupSteps = [
    {
      title: "Set Business Name",
      description: "Configure your account or business name in Stripe Dashboard",
      link: "https://dashboard.stripe.com/account",
      required: true
    },
    {
      title: "Enable INR Currency", 
      description: "Add Indian Rupees to your supported currencies",
      link: "https://dashboard.stripe.com/settings/account",
      required: true
    },
    {
      title: "Configure Products & Prices",
      description: "Create your subscription plans and one-time payment prices",
      link: "https://dashboard.stripe.com/products",
      required: false
    },
    {
      title: "Test Mode Setup",
      description: "Use test mode for development and testing",
      link: "https://dashboard.stripe.com/test",
      required: false
    }
  ];

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Stripe Configuration Required:</strong> Please complete the setup steps below to enable payments.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Stripe Dashboard Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {setupSteps.map((step, index) => (
            <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {step.required ? (
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <h3 className="font-medium">{step.title}</h3>
                  {step.required && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {step.description}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open(step.link, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open in Stripe
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Common Error Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
            <p className="text-sm font-medium text-red-800">
              "In order to use Checkout, you must set an account or business name"
            </p>
            <p className="text-sm text-red-600 mt-1">
              → Go to Account Settings and add your business name
            </p>
          </div>
          
          <div className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
            <p className="text-sm font-medium text-orange-800">
              "Currency not supported"
            </p>
            <p className="text-sm text-orange-600 mt-1">
              → Enable INR (Indian Rupee) in your Stripe account settings
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StripeSetupGuide;