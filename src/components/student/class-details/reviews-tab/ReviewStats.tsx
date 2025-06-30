
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { ReviewStats as ReviewStatsType } from "@/hooks/use-class-reviews";
import StarDisplay from "./StarDisplay";

interface ReviewStatsProps {
  reviewStats: ReviewStatsType;
  user: any;
  isUserEnrolled: boolean;
  hasUserReviewed: boolean;
  onWriteReviewClick: () => void;
}

const ReviewStats = ({
  reviewStats,
  user,
  isUserEnrolled,
  hasUserReviewed,
  onWriteReviewClick
}: ReviewStatsProps) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <StarDisplay rating={Math.round(reviewStats.averageRating)} size="md" />
              <span className="text-2xl font-bold">
                {reviewStats.averageRating.toFixed(1)}
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Based on {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''}
            </p>
          </div>
          
          {user && isUserEnrolled && (
            <Button 
              onClick={onWriteReviewClick}
              className="bg-primary hover:bg-primary/90"
            >
              <Edit className="h-4 w-4 mr-2" />
              {hasUserReviewed ? "Update Review" : "Write a Review"}
            </Button>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default ReviewStats;
