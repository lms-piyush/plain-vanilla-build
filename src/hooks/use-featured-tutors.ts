import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FeaturedTutor {
  id: string;
  full_name: string;
  bio: string | null;
  avatar_url: string | null;
  total_classes: number;
  average_rating: number;
  total_students: number;
}

export const useFeaturedTutors = (limit: number = 6) => {
  return useQuery({
    queryKey: ['featured-tutors', limit],
    queryFn: async () => {
      const { data: tutors, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          bio,
          avatar_url
        `)
        .eq('role', 'tutor')
        .limit(limit);

      if (error) throw error;

      // Get stats for each tutor
      const tutorsWithStats = await Promise.all(
        (tutors || []).map(async (tutor) => {
          // Get class IDs first
          const { data: tutorClasses } = await supabase
            .from('classes')
            .select('id')
            .eq('tutor_id', tutor.id);

          const classIds = (tutorClasses || []).map(c => c.id);

          const [classesResult, enrollmentsResult, reviewsResult] = await Promise.all([
            supabase
              .from('classes')
              .select('id', { count: 'exact' })
              .eq('tutor_id', tutor.id)
              .eq('status', 'active'),
            classIds.length > 0 
              ? supabase
                  .from('student_enrollments')
                  .select('id', { count: 'exact' })
                  .in('class_id', classIds)
              : Promise.resolve({ count: 0 }),
            classIds.length > 0
              ? supabase
                  .from('class_reviews')
                  .select('rating')
                  .in('class_id', classIds)
              : Promise.resolve({ data: [] }),
          ]);

          const totalClasses = classesResult.count || 0;
          const totalStudents = enrollmentsResult.count || 0;
          const reviews = reviewsResult.data || [];
          const averageRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

          return {
            ...tutor,
            total_classes: totalClasses,
            total_students: totalStudents,
            average_rating: Math.round(averageRating * 10) / 10,
          };
        })
      );

      // Sort by rating and number of students
      return tutorsWithStats.sort((a, b) => {
        if (b.average_rating !== a.average_rating) {
          return b.average_rating - a.average_rating;
        }
        return b.total_students - a.total_students;
      });
    },
  });
};
