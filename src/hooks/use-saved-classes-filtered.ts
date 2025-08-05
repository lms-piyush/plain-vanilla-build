import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TutorClassWithReviews } from "./use-all-classes-with-reviews";

interface UseSavedClassesFilteredParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'popular' | 'rating' | 'newest';
}

export const useSavedClassesFiltered = (params: UseSavedClassesFilteredParams = {}) => {
  const { 
    page = 1, 
    pageSize = 12, 
    sortBy = 'newest'
  } = params;

  return useQuery({
    queryKey: ["saved-classes-filtered", page, pageSize, sortBy],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { classes: [], totalCount: 0 };
      }

      console.log("Fetching saved classes for user:", user.id);

      // First, get the saved class IDs
      const { data: savedClassIds, error: savedError } = await supabase
        .from("saved_classes")
        .select("class_id")
        .eq("student_id", user.id);

      if (savedError) {
        console.error("Error fetching saved class IDs:", savedError);
        throw savedError;
      }

      if (!savedClassIds || savedClassIds.length === 0) {
        return { classes: [], totalCount: 0 };
      }

      const classIds = savedClassIds.map(saved => saved.class_id);
      console.log("Found saved class IDs:", classIds);

      // Then get the class details for those IDs
      let query = supabase
        .from("classes")
        .select(`
          *,
          profiles!classes_tutor_id_fkey(full_name),
          class_reviews(rating),
          student_enrollments(id)
        `, { count: 'exact' })
        .in("id", classIds)
        .eq("status", "active");

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order("created_at", { ascending: false });
          break;
        case 'rating':
          query = query.order("created_at", { ascending: false });
          break;
        case 'popular':
          query = query.order("created_at", { ascending: false });
          break;
      }

      // Apply pagination
      query = query.range((page - 1) * pageSize, page * pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching saved classes details:", error);
        throw error;
      }

      console.log("Raw saved classes data:", data);

      let classesWithReviews: TutorClassWithReviews[] = data?.map(classItem => {
        const reviews = classItem.class_reviews || [];
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 
          ? Math.round((reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews) * 10) / 10
          : 0;

        const studentCount = classItem.student_enrollments?.length || 0;

        return {
          ...classItem,
          tutor_name: classItem.profiles?.full_name || "Unknown Tutor",
          average_rating: averageRating,
          total_reviews: totalReviews,
          student_count: studentCount
        };
      }) || [];

      // Apply client-side sorting for rating and popularity
      if (sortBy === 'rating') {
        classesWithReviews.sort((a, b) => b.average_rating - a.average_rating);
      } else if (sortBy === 'popular') {
        classesWithReviews.sort((a, b) => b.student_count - a.student_count);
      }

      console.log("Processed saved classes:", classesWithReviews.length);

      return {
        classes: classesWithReviews,
        totalCount: count || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};