
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import StarDisplay from "@/components/student/class-details/reviews-tab/StarDisplay";
import { TutorFeedback } from "@/hooks/use-tutor-feedback";

interface FeedbackCardProps {
  feedback: TutorFeedback;
}

const FeedbackCard = ({ feedback }: FeedbackCardProps) => {
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
              {feedback.profiles?.full_name || `Student ${feedback.student_id.slice(-4)}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(feedback.created_at)}
            </p>
          </div>
          <StarDisplay rating={feedback.rating} />
        </div>

        <div className="mb-3">
          <p className="text-sm font-medium text-muted-foreground">
            Class: {feedback.classes?.title || "Unknown Class"}
          </p>
        </div>
        
        {feedback.review_text && (
          <p className="text-gray-700 leading-relaxed">
            {feedback.review_text}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
