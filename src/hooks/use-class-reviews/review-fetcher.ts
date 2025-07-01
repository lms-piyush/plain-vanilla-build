
import { supabase } from "@/integrations/supabase/client";
import { ClassReview, ReviewStats } from "./types";

export const REVIEWS_PER_PAGE = 10;

export const fetchReviews = async (
  classId: string,
  page: number = 1
): Promise<{
  reviews: ClassReview[];
  hasMore: boolean;
}> => {
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

  const hasMore = (reviewsData?.length || 0) === REVIEWS_PER_PAGE;

  return {
    reviews: processedReviews,
    hasMore
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
