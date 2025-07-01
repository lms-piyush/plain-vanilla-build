
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TutorClassWithReviews {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  delivery_mode: string;
  class_format: string;
  class_size: string;
  price: number | null;
  currency: string | null;
  status: string;
  tutor_id: string;
  subject: string | null;
  max_students: number | null;
  profiles: {
    full_name: string;
  } | null;
  student_count: number;
  average_rating: number;
  total_reviews: number;
}

export const useAllClassesWithReviews = () => {
  return useQuery({
    queryKey: ["all-classes-with-reviews"],
    queryFn: async () => {
      const { data: classes, error } = await supabase
        .from("classes")
        .select(`
          id,
          title,
          description,
          thumbnail_url,
          delivery_mode,
          class_format,
          class_size,
          price,
          currency,
          status,
          tutor_id,
          subject,
          max_students,
          profiles (
            full_name
          )
        `)
        .eq("status", "active");

      if (error) throw error;

      // Fetch review stats and student counts for each class
      const enrichedClasses = await Promise.all(
        (classes || []).map(async (classItem) => {
          // Get review stats
          const { data: reviewsData } = await supabase
            .from("class_reviews")
            .select("rating")
            .eq("class_id", classItem.id);

          const totalReviews = reviewsData?.length || 0;
          const averageRating = totalReviews > 0 
            ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
            : 0;

          // Get student count
          const { count: studentCount } = await supabase
            .from("student_enrollments")
            .select("*", { count: "exact", head: true })
            .eq("class_id", classItem.id)
            .eq("status", "active");

          return {
            ...classItem,
            student_count: studentCount || 0,
            average_rating: averageRating,
            total_reviews: totalReviews
          };
        })
      );

      return enrichedClasses as TutorClassWithReviews[];
    },
  });
};
