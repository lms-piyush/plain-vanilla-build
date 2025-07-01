
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
    currentPage,
    totalPages,
    totalReviewCount,
    submitReview,
    goToPage,
  } = useClassReviews(classId);

  const handleSubmitReview = async (rating: number, reviewText: string) => {
    setIsSubmitting(true);
    const success = await submitReview(rating, reviewText);
    setIsSubmitting(false);
    return success;
  };

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log("Reviews Tab Debug:", {
    totalReviewCount,
    totalPages,
    currentPage,
    reviewsLength: reviews.length,
    hasReviews: reviews.length > 0
  });

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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
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
