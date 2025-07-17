import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { notificationService } from "@/services/notification-service";

export interface TutorReview {
  id: string;
  tutor_id: string;
  student_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  student_profile: {
    full_name: string;
  } | null;
}

export interface TutorReviewStats {
  averageRating: number;
  totalReviews: number;
}

export const useTutorReviews = (tutorId: string, page: number = 1, pageSize: number = 10) => {
  const [reviews, setReviews] = useState<TutorReview[]>([]);
  const [reviewStats, setReviewStats] = useState<TutorReviewStats>({ averageRating: 0, totalReviews: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [userReview, setUserReview] = useState<TutorReview | null>(null);
  const [isUserEligible, setIsUserEligible] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviewCount, setTotalReviewCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadReviews = async () => {
    if (!tutorId) return;

    try {
      setIsLoading(true);
      
      // Get total count first
      const { count, error: countError } = await supabase
        .from("tutor_reviews")
        .select("*", { count: "exact", head: true })
        .eq("tutor_id", tutorId);

      if (countError) throw countError;

      const totalCount = count || 0;
      setTotalReviewCount(totalCount);
      setTotalPages(Math.ceil(totalCount / pageSize));
      
      // Fetch paginated reviews 
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("tutor_reviews")
        .select("*")
        .eq("tutor_id", tutorId)
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      if (reviewsError) throw reviewsError;

      // Fetch profile data separately for each review
      const reviewsWithProfiles = await Promise.all(
        (reviewsData || []).map(async (review) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", review.student_id)
            .single();

          return {
            ...review,
            student_profile: profileData
          };
        })
      );

      // Calculate stats from all reviews
      const { data: allReviewsData, error: allReviewsError } = await supabase
        .from("tutor_reviews")
        .select("rating")
        .eq("tutor_id", tutorId);

      if (allReviewsError) throw allReviewsError;

      const totalReviews = allReviewsData?.length || 0;
      const averageRating = totalReviews > 0 
        ? allReviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;

      setReviews(reviewsWithProfiles || []);
      setReviewStats({ averageRating, totalReviews });

      // Check user eligibility and review status
      if (user) {
        // Check if user is eligible to review (has classes with this tutor)
        const { data: classIds, error: classError } = await supabase
          .from("classes")
          .select("id")
          .eq("tutor_id", tutorId);

        if (classError) throw classError;

        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from("student_enrollments")
          .select("id")
          .eq("student_id", user.id)
          .in("class_id", classIds?.map(c => c.id) || []);

        if (enrollmentError) throw enrollmentError;

        setIsUserEligible((enrollmentData?.length || 0) > 0);

        // Check if user has already reviewed this tutor
        const userReviewData = reviewsWithProfiles?.find(review => review.student_id === user.id);
        setHasUserReviewed(!!userReviewData);
        setUserReview(userReviewData || null);
      }

    } catch (error: any) {
      console.error("Error fetching tutor reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
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

    if (!isUserEligible) {
      toast({
        title: "Not Eligible",
        description: "You must have taken a class with this tutor to submit a review.",
        variant: "destructive",
      });
      return false;
    }

    try {
      if (userReview) {
        // Update existing review
        const { error } = await supabase
          .from("tutor_reviews")
          .update({
            rating,
            review_text: reviewText.trim() || null,
          })
          .eq("id", userReview.id);

        if (error) throw error;

        // Send notification to tutor for updated review
        try {
          const { data: studentData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();

          if (studentData) {
            await notificationService.notifyTutorReview(
              tutorId,
              studentData.full_name,
              rating,
              reviewText,
              true // isUpdate = true
            );
          }
        } catch (notificationError) {
          console.error("Failed to send updated tutor review notification:", notificationError);
        }
      } else {
        // Create new review
        const { error } = await supabase
          .from("tutor_reviews")
          .insert({
            tutor_id: tutorId,
            student_id: user.id,
            rating,
            review_text: reviewText.trim() || null,
          });

        if (error) throw error;

        // Send notification to tutor for new review
        try {
          const { data: studentData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();

          if (studentData) {
            await notificationService.notifyTutorReview(
              tutorId,
              studentData.full_name,
              rating,
              reviewText,
              false // isUpdate = false
            );
          }
        } catch (notificationError) {
          console.error("Failed to send tutor review notification:", notificationError);
        }
      }

      toast({
        title: hasUserReviewed ? "Review Updated" : "Review Submitted",
        description: hasUserReviewed 
          ? "Your review has been updated successfully!" 
          : "Thank you for your feedback!",
      });

      // Refresh reviews
      await loadReviews();
      return true;

    } catch (error: any) {
      console.error("Error submitting tutor review:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    loadReviews();
  }, [tutorId, user, currentPage]);

  return {
    reviews,
    reviewStats,
    isLoading,
    hasUserReviewed,
    userReview,
    isUserEligible,
    currentPage,
    totalPages,
    totalReviewCount,
    submitReview,
    goToPage,
    refetch: loadReviews,
  };
};