
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
import { useTutorReviews } from "@/hooks/use-tutor-reviews";
import { useStudentClassDetails } from "@/hooks/use-student-class-details";
import WriteReviewModal from "./WriteReviewModal";
import ReviewTypeModal from "./ReviewTypeModal";
import ReviewStats from "./reviews-tab/ReviewStats";
import ReviewCard from "./reviews-tab/ReviewCard";
import TutorReviewCard from "./reviews-tab/TutorReviewCard";
import EmptyReviewsState from "./reviews-tab/EmptyReviewsState";

interface ReviewsTabProps {
  classId: string;
}

const ReviewsTab = ({ classId }: ReviewsTabProps) => {
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [isReviewTypeOpen, setIsReviewTypeOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentReviewType, setCurrentReviewType] = useState<"class" | "tutor">("class");
  const { user } = useAuth();
  
  const { classDetails } = useStudentClassDetails(classId);
  
  const {
    reviews: classReviews,
    reviewStats,
    isLoading: isLoadingClassReviews,
    hasUserReviewed: hasClassReviewed,
    userReview: classReview,
    isUserEnrolled,
    currentPage,
    totalPages,
    totalReviewCount,
    submitReview: submitClassReview,
    goToPage,
  } = useClassReviews(classId);

  const {
    hasUserReviewed: hasTutorReviewed,
    userReview: tutorReview,
    submitReview: submitTutorReview,
  } = useTutorReviews(classDetails?.tutor_id || "");

  const isLoading = isLoadingClassReviews;

  const handleReviewTypeSelect = (type: "class" | "tutor") => {
    setCurrentReviewType(type);
    setIsReviewTypeOpen(false);
    setIsWriteReviewOpen(true);
  };

  const handleSubmitReview = async (rating: number, reviewText: string) => {
    setIsSubmitting(true);
    const success = currentReviewType === "class" 
      ? await submitClassReview(rating, reviewText)
      : await submitTutorReview(rating, reviewText);
    setIsSubmitting(false);
    return success;
  };

  const getCurrentReview = (): any => {
    return currentReviewType === "class" ? classReview : tutorReview;
  };

  const hasCurrentReview = () => {
    return currentReviewType === "class" ? hasClassReviewed : hasTutorReviewed;
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
    reviewsLength: classReviews.length,
    hasReviews: classReviews.length > 0
  });

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      <ReviewStats
        reviewStats={reviewStats}
        user={user}
        isUserEnrolled={isUserEnrolled}
        hasUserReviewed={hasClassReviewed || hasTutorReviewed}
        onWriteReviewClick={() => setIsReviewTypeOpen(true)}
      />

      {/* Reviews List */}
      <div className="space-y-4">
        {classReviews.length === 0 ? (
          <EmptyReviewsState isUserEnrolled={isUserEnrolled} />
        ) : (
          <>
            {classReviews.map((review) => (
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

      {/* Review Type Modal */}
      <ReviewTypeModal
        isOpen={isReviewTypeOpen}
        onClose={() => setIsReviewTypeOpen(false)}
        onSelectType={handleReviewTypeSelect}
        hasClassReview={hasClassReviewed}
        hasTutorReview={hasTutorReviewed}
        tutorName={classDetails?.tutor_name || ""}
        className={classDetails?.title || ""}
      />

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteReviewOpen}
        onClose={() => setIsWriteReviewOpen(false)}
        onSubmit={handleSubmitReview}
        isSubmitting={isSubmitting}
        existingReview={getCurrentReview()}
        isUpdate={hasCurrentReview()}
      />
    </div>
  );
};

export default ReviewsTab;
