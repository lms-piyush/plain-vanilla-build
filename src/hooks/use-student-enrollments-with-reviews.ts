
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EnrollmentWithReviews {
  id: string;
  class_id: string;
  student_id: string;
  status: string;
  enrollment_date: string;
  payment_status: string;
  classes: {
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
    profiles: {
      full_name: string;
    } | null;
    student_count: number;
    average_rating: number;
    total_reviews: number;
  };
}

export const useStudentEnrollmentsWithReviews = () => {
  return useQuery({
    queryKey: ["student-enrollments-with-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_enrollments")
        .select(`
          id,
          class_id,
          student_id,
          status,
          enrollment_date,
          payment_status,
          classes (
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
            profiles (
              full_name
            )
          )
        `)
        .eq("student_id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      // Fetch review stats and student counts for each class
      const enrichedData = await Promise.all(
        (data || []).map(async (enrollment) => {
          // Get review stats
          const { data: reviewsData } = await supabase
            .from("class_reviews")
            .select("rating")
            .eq("class_id", enrollment.class_id);

          const totalReviews = reviewsData?.length || 0;
          const averageRating = totalReviews > 0 
            ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
            : 0;

          // Get student count
          const { count: studentCount } = await supabase
            .from("student_enrollments")
            .select("*", { count: "exact", head: true })
            .eq("class_id", enrollment.class_id)
            .eq("status", "active");

          return {
            ...enrollment,
            classes: {
              ...enrollment.classes,
              student_count: studentCount || 0,
              average_rating: averageRating,
              total_reviews: totalReviews
            }
          };
        })
      );

      return enrichedData as EnrollmentWithReviews[];
    },
  });
};
