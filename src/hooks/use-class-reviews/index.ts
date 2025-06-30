
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ClassReview, ReviewStats } from "./types";
import { fetchReviews, fetchReviewStats } from "./review-fetcher";
import { checkUserEnrollmentAndReview } from "./enrollment-checker";
import { submitReview as submitReviewApi } from "./review-submitter";

export const useClassReviews = (classId: string) => {
  const [reviews, setReviews] = useState<ClassReview[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({ averageRating: 0, totalReviews: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [userReview, setUserReview] = useState<ClassReview | null>(null);
  const [isUserEnrolled, setIsUserEnrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadReviews = async (page: number = 1, reset: boolean = false) => {
    if (!classId) return;

    try {
      setIsLoading(true);
      
      const { reviews: newReviews, hasMore } = await fetchReviews(classId, page);
      const stats = await fetchReviewStats(classId);

      if (reset || page === 1) {
        setReviews(newReviews);
      } else {
        setReviews(prev => [...prev, ...newReviews]);
      }

      setReviewStats(stats);
      setHasMoreReviews(hasMore);

      // Check user enrollment and review status
      if (user) {
        const { isEnrolled, hasReviewed, userReview: userReviewData } = 
          await checkUserEnrollmentAndReview(classId, user.id);

        setIsUserEnrolled(isEnrolled);
        setHasUserReviewed(hasReviewed);
        setUserReview(userReviewData);
      }

    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitReview = async (rating: number, reviewText: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a review.",
        variant: "destructive",
      });
      return false;
    }

    if (!isUserEnrolled) {
      toast({
        title: "Enrollment Required",
        description: "You must be enrolled in this class to submit a review.",
        variant: "destructive",
      });
      return false;
    }

    try {
      await submitReviewApi(classId, user.id, rating, reviewText, userReview);

      toast({
        title: hasUserReviewed ? "Review Updated" : "Review Submitted",
        description: hasUserReviewed 
          ? "Your review has been updated successfully!" 
          : "Thank you for your feedback!",
      });

      // Refresh reviews
      await loadReviews(1, true);
      setCurrentPage(1);
      return true;

    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const loadMoreReviews = () => {
    if (!hasMoreReviews || isLoading) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadReviews(nextPage, false);
  };

  useEffect(() => {
    loadReviews(1, true);
  }, [classId, user]);

  return {
    reviews,
    reviewStats,
    isLoading,
    hasUserReviewed,
    userReview,
    isUserEnrolled,
    hasMoreReviews,
    submitReview,
    loadMoreReviews,
    refetch: () => loadReviews(1, true),
  };
};

export type { ClassReview, ReviewStats };
