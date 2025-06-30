import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ClassReview {
  id: string;
  class_id: string;
  student_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  profiles?: {
    full_name: string;
  } | null;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

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

  const REVIEWS_PER_PAGE = 10;

  const fetchReviews = async (page: number = 1, reset: boolean = false) => {
    if (!classId) return;

    try {
      setIsLoading(true);
      
      const startIndex = (page - 1) * REVIEWS_PER_PAGE;
      const endIndex = startIndex + REVIEWS_PER_PAGE - 1;

      // Fetch reviews with profile data using proper join syntax
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("class_reviews")
        .select(`
          id,
          class_id,
          student_id,
          rating,
          review_text,
          created_at,
          profiles (
            full_name
          )
        `)
        .eq("class_id", classId)
        .order("created_at", { ascending: false })
        .range(startIndex, endIndex);

      if (reviewsError) {
        console.error("Reviews query error:", reviewsError);
        throw reviewsError;
      }

      // Process reviews to ensure type safety
      const processedReviews: ClassReview[] = (reviewsData || []).map(review => ({
        id: review.id,
        class_id: review.class_id,
        student_id: review.student_id,
        rating: review.rating,
        review_text: review.review_text,
        created_at: review.created_at,
        profiles: review.profiles ? { full_name: review.profiles.full_name } : null
      }));

      if (reset || page === 1) {
        setReviews(processedReviews);
      } else {
        setReviews(prev => [...prev, ...processedReviews]);
      }

      // Fetch review statistics
      const { data: statsData, error: statsError } = await supabase
        .from("class_reviews")
        .select("rating")
        .eq("class_id", classId);

      if (statsError) throw statsError;

      // Calculate stats
      const totalReviews = statsData?.length || 0;
      const averageRating = totalReviews > 0 
        ? statsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;

      setReviewStats({ averageRating, totalReviews });
      setHasMoreReviews((reviewsData?.length || 0) === REVIEWS_PER_PAGE);

      // Check if current user is enrolled and has reviewed
      if (user) {
        // Check enrollment status
        const { data: enrollmentData } = await supabase
          .from("student_enrollments")
          .select("id")
          .eq("class_id", classId)
          .eq("student_id", user.id)
          .eq("status", "active")
          .maybeSingle();

        setIsUserEnrolled(!!enrollmentData);

        // Check if user has reviewed
        const { data: userReviewData } = await supabase
          .from("class_reviews")
          .select("*")
          .eq("class_id", classId)
          .eq("student_id", user.id)
          .maybeSingle();

        if (userReviewData) {
          setHasUserReviewed(true);
          setUserReview(userReviewData);
        } else {
          setHasUserReviewed(false);
          setUserReview(null);
        }
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
      if (hasUserReviewed && userReview) {
        // Update existing review
        const { error } = await supabase
          .from("class_reviews")
          .update({
            rating,
            review_text: reviewText.trim() || null,
          })
          .eq("id", userReview.id);

        if (error) throw error;

        toast({
          title: "Review Updated",
          description: "Your review has been updated successfully!",
        });
      } else {
        // Create new review
        const { error } = await supabase
          .from("class_reviews")
          .insert({
            class_id: classId,
            student_id: user.id,
            rating,
            review_text: reviewText.trim() || null,
          });

        if (error) throw error;

        toast({
          title: "Review Submitted",
          description: "Thank you for your feedback!",
        });
      }

      // Refresh reviews
      await fetchReviews(1, true);
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
    fetchReviews(nextPage, false);
  };

  useEffect(() => {
    fetchReviews(1, true);
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
    refetch: () => fetchReviews(1, true),
  };
};
