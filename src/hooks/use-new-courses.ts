import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NewCourse {
  id: string;
  title: string;
  tutor_name: string;
  average_rating: number;
  thumbnail_url: string | null;
}

export const useNewCourses = () => {
  return useQuery({
    queryKey: ["new-courses"],
    queryFn: async () => {
      console.log("Fetching new courses...");

      const { data, error } = await supabase
        .from("classes")
        .select(`
          id,
          title,
          thumbnail_url,
          profiles!classes_tutor_id_fkey(full_name),
          class_reviews(rating)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching new courses:", error);
        throw error;
      }

      const newCourses: NewCourse[] = data?.map(course => {
        const reviews = course.class_reviews || [];
        const averageRating = reviews.length > 0 
          ? Math.round((reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length) * 10) / 10
          : 0;

        return {
          id: course.id,
          title: course.title,
          tutor_name: course.profiles?.full_name || "Unknown Tutor",
          average_rating: averageRating,
          thumbnail_url: course.thumbnail_url
        };
      }) || [];

      console.log("Processed new courses:", newCourses);
      return newCourses;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};