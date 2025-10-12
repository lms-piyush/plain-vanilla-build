
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TutorClassWithReviews {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  delivery_mode: 'online' | 'offline';
  class_format: 'live' | 'recorded' | 'inbound' | 'outbound';
  class_size: 'group' | 'one-on-one';
  duration_type: 'recurring' | 'fixed';
  status: 'draft' | 'active' | 'inactive' | 'completed' | 'running';
  price: number | null;
  currency: string | null;
  max_students: number | null;
  thumbnail_url: string | null;
  tutor_id: string;
  created_at: string;
  updated_at: string;
  tutor_name: string;
  average_rating: number;
  total_reviews: number;
  student_count: number;
}

interface UseAllClassesWithReviewsParams {
  page?: number;
  pageSize?: number;
}

export const useAllClassesWithReviews = (params: UseAllClassesWithReviewsParams = {}) => {
  const { page = 1, pageSize = 12 } = params;

  return useQuery({
    queryKey: ["all-classes-with-reviews", page, pageSize],
    queryFn: async () => {
      console.log("Fetching all classes with reviews...");

      const { data, error, count } = await supabase
        .from("classes")
        .select(`
          *,
          profiles!classes_tutor_id_fkey(full_name),
          class_reviews(rating),
          student_enrollments(id)
        `, { count: 'exact' })
        .eq("status", "active")
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching classes with reviews:", error);
        throw error;
      }

      console.log("Raw classes data:", data);

      const classesWithReviews: TutorClassWithReviews[] = (data as any[])?.map((classItem: any) => {
        const reviews = classItem.class_reviews || [];
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 
          ? Math.round((reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews) * 10) / 10
          : 0;

        const studentCount = classItem.student_enrollments?.length || 0;

        return {
          id: classItem.id,
          title: classItem.title,
          description: classItem.description ?? null,
          subject: classItem.subject ?? null,
          delivery_mode: classItem.delivery_mode as any,
          class_format: classItem.class_format as any,
          class_size: classItem.class_size as any,
          duration_type: classItem.duration_type as any,
          status: classItem.status as any,
          price: classItem.price ?? null,
          currency: classItem.currency ?? null,
          max_students: classItem.max_students ?? null,
          thumbnail_url: classItem.thumbnail_url ?? null,
          tutor_id: classItem.tutor_id,
          created_at: classItem.created_at,
          updated_at: classItem.updated_at,
          tutor_name: classItem.profiles?.full_name || "Unknown Tutor",
          average_rating: averageRating,
          total_reviews: totalReviews,
          student_count: studentCount,
        } as TutorClassWithReviews;
      }) || [];

      console.log("Processed classes with reviews:", classesWithReviews.length);

      return {
        classes: classesWithReviews,
        totalCount: count || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
