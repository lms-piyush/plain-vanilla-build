
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ClassReviewStats {
  average_rating: number;
  total_reviews: number;
}

export const useClassReviewStats = (classId: string) => {
  return useQuery({
    queryKey: ["class-review-stats", classId],
    queryFn: async (): Promise<ClassReviewStats> => {
      if (!classId) {
        return { average_rating: 0, total_reviews: 0 };
      }

      const { data, error } = await supabase
        .from("class_reviews")
        .select("rating")
        .eq("class_id", classId);

      if (error) {
        console.error("Error fetching class review stats:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        return { average_rating: 0, total_reviews: 0 };
      }

      const totalReviews = data.length;
      const averageRating = data.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

      return {
        average_rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        total_reviews: totalReviews
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
