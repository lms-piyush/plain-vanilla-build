import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TutorClassWithReviews } from "./use-all-classes-with-reviews";

export interface ClassFilters {
  classMode?: 'online' | 'offline';
  classFormat?: 'live' | 'recorded' | 'inbound' | 'outbound';
  classSize?: 'group' | '1-on-1';
  classDuration?: 'recurring' | 'fixed';
  paymentModel?: 'one-time' | 'subscription';
  sortBy?: 'popular' | 'rating' | 'newest';
}

interface UseFilteredClassesParams extends ClassFilters {
  page?: number;
  pageSize?: number;
  enrolledOnly?: boolean;
  enrolledClasses?: string[];
}

export const useFilteredClasses = (params: UseFilteredClassesParams = {}) => {
  const { 
    page = 1, 
    pageSize = 12, 
    enrolledOnly = false,
    enrolledClasses = [],
    classMode,
    classFormat,
    classSize,
    classDuration,
    paymentModel,
    sortBy = 'newest'
  } = params;

  return useQuery({
    queryKey: [
      "filtered-classes", 
      page, 
      pageSize, 
      enrolledOnly, 
      enrolledClasses,
      classMode,
      classFormat,
      classSize,
      classDuration,
      paymentModel,
      sortBy
    ],
    queryFn: async () => {
      console.log("Fetching filtered classes with params:", params);

      let query = supabase
        .from("classes")
        .select(`
          *,
          profiles!classes_tutor_id_fkey(full_name),
          class_reviews(rating),
          student_enrollments(id)
        `, { count: 'exact' })
        .eq("status", "active");

      // Apply filters
      if (classMode) {
        query = query.eq("delivery_mode", classMode);
      }
      
      if (classFormat) {
        query = query.eq("class_format", classFormat);
      }
      
      if (classSize) {
        const sizeValue = classSize === "1-on-1" ? "one-on-one" : "group";
        query = query.eq("class_size", sizeValue);
      }
      
      if (classDuration) {
        query = query.eq("duration_type", classDuration);
      }

      // Apply enrollment filter
      if (enrolledOnly && enrolledClasses.length > 0) {
        query = query.in("id", enrolledClasses);
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order("created_at", { ascending: false });
          break;
        case 'rating':
          // For rating, we'll sort by created_at first, then sort by rating in the processing
          query = query.order("created_at", { ascending: false });
          break;
        case 'popular':
          // For popularity, we'll sort by created_at first, then sort by student count in the processing
          query = query.order("created_at", { ascending: false });
          break;
      }

      // Apply pagination
      query = query.range((page - 1) * pageSize, page * pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching filtered classes:", error);
        throw error;
      }

      console.log("Raw filtered classes data:", data);

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
      // (since these require computed values)
      if (sortBy === 'rating') {
        classesWithReviews.sort((a, b) => b.average_rating - a.average_rating);
      } else if (sortBy === 'popular') {
        classesWithReviews.sort((a, b) => b.student_count - a.student_count);
      }

      console.log("Processed filtered classes:", classesWithReviews.length);

      return {
        classes: classesWithReviews,
        totalCount: count || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};