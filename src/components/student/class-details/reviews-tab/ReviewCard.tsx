
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ClassReview } from "@/hooks/use-class-reviews";
import StarDisplay from "./StarDisplay";

interface ReviewCardProps {
  review: ClassReview;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',  
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-medium">
              Anonymous Student
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(review.created_at)}
            </p>
          </div>
          <StarDisplay rating={review.rating} />
        </div>
        
        {review.review_text && (
          <p className="text-gray-700 leading-relaxed">
            {review.review_text}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
