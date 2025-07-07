import React from "react";
import { useClassReviews } from "@/hooks/use-class-reviews";
import ReviewCard from "@/components/student/class-details/reviews-tab/ReviewCard";
import ReviewStats from "@/components/student/class-details/reviews-tab/ReviewStats";
import EmptyReviewsState from "@/components/student/class-details/reviews-tab/EmptyReviewsState";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ReviewsTabProps {
  classId: string;
}

const ReviewsTab = ({ classId }: ReviewsTabProps) => {
  const {
    reviews,
    reviewStats,
    isLoading,
    currentPage,
    totalPages,
    totalReviewCount,
    goToPage,
  } = useClassReviews(classId);

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

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      <ReviewStats
        reviewStats={reviewStats}
        user={null} // Tutors don't need write review functionality here
        isUserEnrolled={false}
        hasUserReviewed={false}
        onWriteReviewClick={() => {}}
      />

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <EmptyReviewsState isUserEnrolled={false} />
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
    </div>
  );
};

export default ReviewsTab;