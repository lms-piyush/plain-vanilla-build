import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, BookOpen } from "lucide-react";
import { useProcessSubscriptionSuccess } from "@/hooks/use-subscription";
import PageLayout from "@/components/PageLayout";

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const processSuccess = useProcessSubscriptionSuccess();

  const sessionId = searchParams.get("session_id");
  const classId = searchParams.get("class_id");

  useEffect(() => {
    if (sessionId) {
      processSuccess.mutate({ sessionId, classId: classId || undefined });
    }
  }, [sessionId, classId]);

  return (
    <PageLayout title="Subscription Success">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Subscription Activated!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-lg text-muted-foreground">
              Thank you for subscribing! Your subscription has been successfully activated.
            </p>

            {processSuccess.isSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">
                  You now have access to all subscription benefits including premium classes and features.
                </p>
              </div>
            )}

            {processSuccess.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">
                  Your payment was successful, but there was an issue processing your subscription. 
                  Please contact support if you don't see your subscription benefits shortly.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/student/dashboard")}
                className="flex items-center"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
              
              {classId && (
                <Button
                  onClick={() => navigate(`/student/classes/${classId}`)}
                  variant="outline"
                  className="flex items-center"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Class
                </Button>
              )}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Need help? Contact our support team at{" "}
                <a href="mailto:support@example.com" className="text-primary hover:underline">
                  support@example.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default SubscriptionSuccess;