import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

export const useTutorReviews = (tutorId: string) => {
  const [reviews, setReviews] = useState<TutorReview[]>([]);
  const [reviewStats, setReviewStats] = useState<TutorReviewStats>({ averageRating: 0, totalReviews: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [userReview, setUserReview] = useState<TutorReview | null>(null);
  const [isUserEligible, setIsUserEligible] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadReviews = async () => {
    if (!tutorId) return;

    try {
      setIsLoading(true);
      
      // Fetch reviews 
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("tutor_reviews")
        .select("*")
        .eq("tutor_id", tutorId)
        .order("created_at", { ascending: false });

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

      // Calculate stats
      const totalReviews = reviewsWithProfiles?.length || 0;
      const averageRating = totalReviews > 0 
        ? reviewsWithProfiles.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
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
  }, [tutorId, user]);

  return {
    reviews,
    reviewStats,
    isLoading,
    hasUserReviewed,
    userReview,
    isUserEligible,
    submitReview,
    refetch: loadReviews,
  };
};