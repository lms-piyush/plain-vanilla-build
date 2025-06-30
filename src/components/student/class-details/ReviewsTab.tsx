
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useClassReviews } from "@/hooks/use-class-reviews";
import WriteReviewModal from "./WriteReviewModal";

interface ReviewsTabProps {
  classId: string;
}

const ReviewsTab = ({ classId }: ReviewsTabProps) => {
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const {
    reviews,
    reviewStats,
    isLoading,
    hasUserReviewed,
    userReview,
    isUserEnrolled,
    hasMoreReviews,
    submitReview,
    loadMoreReviews,
  } = useClassReviews(classId);

  const handleSubmitReview = async (rating: number, reviewText: string) => {
    setIsSubmitting(true);
    const success = await submitReview(rating, reviewText);
    setIsSubmitting(false);
    return success;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${starSize} ${
              i < rating
                ? 'fill-yellow-400 stroke-yellow-400'
                : 'stroke-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                {renderStars(Math.round(reviewStats.averageRating), "md")}
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
                onClick={() => setIsWriteReviewOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Edit className="h-4 w-4 mr-2" />
                {hasUserReviewed ? "Update Review" : "Write a Review"}
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                No reviews yet. {isUserEnrolled ? "Be the first to share your experience!" : "Enroll in this class to write a review."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium">
                        {review.profiles?.full_name || `Student ${review.student_id.slice(-4)}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  
                  {review.review_text && (
                    <p className="text-gray-700 leading-relaxed">
                      {review.review_text}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Load More Button */}
            {hasMoreReviews && (
              <div className="text-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={loadMoreReviews}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Load More Reviews"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteReviewOpen}
        onClose={() => setIsWriteReviewOpen(false)}
        onSubmit={handleSubmitReview}
        isSubmitting={isSubmitting}
        existingReview={userReview}
        isUpdate={hasUserReviewed}
      />
    </div>
  );
};

export default ReviewsTab;
