
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useClassReviews } from "@/hooks/use-class-reviews";
import WriteReviewModal from "./WriteReviewModal";
import ReviewStats from "./reviews-tab/ReviewStats";
import ReviewCard from "./reviews-tab/ReviewCard";
import EmptyReviewsState from "./reviews-tab/EmptyReviewsState";

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
      <ReviewStats
        reviewStats={reviewStats}
        user={user}
        isUserEnrolled={isUserEnrolled}
        hasUserReviewed={hasUserReviewed}
        onWriteReviewClick={() => setIsWriteReviewOpen(true)}
      />

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <EmptyReviewsState isUserEnrolled={isUserEnrolled} />
        ) : (
          <>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
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
