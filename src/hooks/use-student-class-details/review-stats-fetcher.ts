
import { supabase } from "@/integrations/supabase/client";

export interface ClassReviewStats {
  averageRating: number;
  totalReviews: number;
}

export const fetchClassReviewStats = async (classId: string): Promise<ClassReviewStats> => {
  const { data: reviewsData, error } = await supabase
    .from("class_reviews")
    .select("rating")
    .eq("class_id", classId);

  if (error) {
    console.error("Error fetching review stats:", error);
    return { averageRating: 0, totalReviews: 0 };
  }

  const totalReviews = reviewsData?.length || 0;
  const averageRating = totalReviews > 0 
    ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  return { averageRating, totalReviews };
};
