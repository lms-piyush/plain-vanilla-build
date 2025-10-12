
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface TutorFeedback {
  id: string;
  class_id: string;
  student_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  profiles: {
    full_name: string;
  } | null;
  classes: {
    title: string;
  } | null;
}

const REVIEWS_PER_PAGE = 2;

export const useTutorFeedback = (page: number = 1) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["tutor-feedback", user?.id, page],
    queryFn: async (): Promise<{
      reviews: TutorFeedback[];
      totalCount: number;
      hasMore: boolean;
    }> => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const startIndex = (page - 1) * REVIEWS_PER_PAGE;
      const endIndex = startIndex + REVIEWS_PER_PAGE - 1;

      // First, get the class IDs for the tutor
      const { data: tutorClasses, error: classesError } = await supabase
        .from("classes")
        .select("id")
        .eq("tutor_id", user.id);

      if (classesError) {
        console.error("Error fetching tutor classes:", classesError);
        throw classesError;
      }

      if (!tutorClasses || tutorClasses.length === 0) {
        return {
          reviews: [],
          totalCount: 0,
          hasMore: false
        };
      }

      const classIds = tutorClasses.map(cls => cls.id);

      // Get total count first
      const { count, error: countError } = await supabase
        .from("class_reviews")
        .select("*", { count: 'exact', head: true })
        .in("class_id", classIds);

      if (countError) {
        console.error("Error fetching review count:", countError);
        throw countError;
      }

      // Fetch reviews with pagination
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
          ),
          classes (
            title
          )
        `)
        .in("class_id", classIds)
        .order("created_at", { ascending: false })
        .range(startIndex, endIndex);

      if (reviewsError) {
        console.error("Error fetching tutor feedback:", reviewsError);
        throw reviewsError;
      }

      const processedReviews: TutorFeedback[] = ((reviewsData as any[]) || []).map((review: any) => ({
        id: review.id,
        class_id: review.class_id,
        student_id: review.student_id,
        rating: review.rating,
        review_text: review.review_text,
        created_at: review.created_at,
        profiles: review.profiles?.[0] || review.profiles || { full_name: 'Unknown Student' },
        classes: review.classes?.[0] || review.classes || { title: 'Unknown Class' }
      }));

      const totalCount = count || 0;
      const hasMore = startIndex + (reviewsData?.length || 0) < totalCount;

      return {
        reviews: processedReviews,
        totalCount,
        hasMore
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
