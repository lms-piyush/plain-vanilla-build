
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyReviewsStateProps {
  isUserEnrolled: boolean;
}

const EmptyReviewsState = ({ isUserEnrolled }: EmptyReviewsStateProps) => {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <p className="text-muted-foreground">
          No reviews yet. {isUserEnrolled ? "Be the first to share your experience!" : "Enroll in this class to write a review."}
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyReviewsState;
