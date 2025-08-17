
import { supabase } from "@/integrations/supabase/client";
import { ClassReview, ReviewStats } from "./types";

export const REVIEWS_PER_PAGE = 10;

export const fetchReviews = async (
  classId: string,
  page: number = 1
): Promise<{
  reviews: ClassReview[];
  hasMore: boolean;
  totalCount: number;
}> => {
  const startIndex = (page - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE - 1;

  // First get the total count
  const { count, error: countError } = await supabase
    .from("class_reviews")
    .select("*", { count: 'exact', head: true })
    .eq("class_id", classId);

  if (countError) {
    console.error("Count query error:", countError);
    throw countError;
  }

  // Fetch reviews without exposing student identities
  const { data: reviewsData, error: reviewsError } = await supabase
    .from("class_reviews")
    .select(`
      id,
      class_id,
      rating,
      review_text,
      created_at
    `)
    .eq("class_id", classId)
    .order("created_at", { ascending: false })
    .range(startIndex, endIndex);

  if (reviewsError) {
    console.error("Reviews query error:", reviewsError);
    throw reviewsError;
  }

  // Process reviews to ensure type safety (no student identity exposure)
  const processedReviews: ClassReview[] = (reviewsData || []).map(review => ({
    id: review.id,
    class_id: review.class_id,
    student_id: '', // Don't expose student ID
    rating: review.rating,
    review_text: review.review_text,
    created_at: review.created_at,
    profiles: null // Don't expose profile data
  }));

  const totalCount = count || 0;
  const hasMore = endIndex < totalCount - 1;

  return {
    reviews: processedReviews,
    hasMore,
    totalCount
  };
};

export const fetchReviewStats = async (classId: string): Promise<ReviewStats> => {
  const { data: statsData, error: statsError } = await supabase
    .from("class_reviews")
    .select("rating")
    .eq("class_id", classId);

  if (statsError) throw statsError;

  const totalReviews = statsData?.length || 0;
  const averageRating = totalReviews > 0 
    ? statsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  return { averageRating, totalReviews };
};
