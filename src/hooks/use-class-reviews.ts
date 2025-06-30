
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

      // Fetch reviews with explicit join to profiles table
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("class_reviews")
        .select(`
          id,
          class_id,
          student_id,
          rating,
          review_text,
          created_at,
          profiles!inner(full_name)
        `)
        .eq("class_id", classId)
        .order("created_at", { ascending: false })
        .range(startIndex, endIndex);

      if (reviewsError) {
        console.error("Reviews query error:", reviewsError);
        // If the join fails, fetch reviews without profile data
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("class_reviews")
          .select("*")
          .eq("class_id", classId)
          .order("created_at", { ascending: false })
          .range(startIndex, endIndex);

        if (fallbackError) throw fallbackError;
        
        const reviewsWithFallback = fallbackData?.map(review => ({
          ...review,
          profiles: null
        })) || [];

        if (reset || page === 1) {
          setReviews(reviewsWithFallback);
        } else {
          setReviews(prev => [...prev, ...reviewsWithFallback]);
        }
      } else {
        // Successfully got reviews with profile data
        if (reset || page === 1) {
          setReviews(reviewsData || []);
        } else {
          setReviews(prev => [...prev, ...(reviewsData || [])]);
        }
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

      // Check if current user has reviewed
      if (user) {
        const { data: userReview } = await supabase
          .from("class_reviews")
          .select("id")
          .eq("class_id", classId)
          .eq("student_id", user.id)
          .maybeSingle();

        setHasUserReviewed(!!userReview);
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

    try {
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
    hasMoreReviews,
    submitReview,
    loadMoreReviews,
    refetch: () => fetchReviews(1, true),
  };
};
