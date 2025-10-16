import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useRecommendedClasses = () => {
  const { user } = useAuth();

  // Fetch recommended classes based on enrollments and recently viewed
  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ['recommended-classes', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get user's enrolled subjects
      const { data: enrollments } = await supabase
        .from('student_enrollments')
        .select('class:classes(subject)')
        .eq('student_id', user.id);

      const enrolledSubjects = enrollments?.map(e => (e.class as any)?.subject).filter(Boolean) || [];

      // Get classes in similar subjects that user hasn't enrolled in
      const { data: similarClasses, error } = await supabase
        .from('classes')
        .select(`
          id,
          title,
          description,
          thumbnail_url,
          price,
          delivery_mode,
          class_format,
          tutor_id,
          subject,
          class_reviews(rating)
        `)
        .eq('status', 'active')
        .in('subject', enrolledSubjects.length > 0 ? enrolledSubjects : ['Math', 'Science', 'English'])
        .not('id', 'in', 
          `(SELECT class_id FROM student_enrollments WHERE student_id = '${user.id}')`
        )
        .limit(6);

      if (error) throw error;

      // Calculate average rating for each class
      return similarClasses?.map(cls => ({
        ...cls,
        average_rating: cls.class_reviews && cls.class_reviews.length > 0
          ? cls.class_reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / cls.class_reviews.length
          : 0
      })) || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return {
    recommendations,
    isLoading,
  };
};
