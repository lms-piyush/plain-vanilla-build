import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MonthlyEngagement {
  month: string;
  students: number;
}

interface RatingTrend {
  month: string;
  avg_rating: number;
}

export interface PublicTutorAnalytics {
  monthlyEngagement: MonthlyEngagement[];
  ratingTrends: RatingTrend[];
  totalCourses: number;
  averageRating: number;
  totalStudents: number;
}

export const usePublicTutorAnalytics = (tutorId: string | undefined) => {
  return useQuery({
    queryKey: ['public-tutor-analytics', tutorId],
    queryFn: async (): Promise<PublicTutorAnalytics> => {
      if (!tutorId) throw new Error('Tutor ID is required');

      // Fetch tutor's classes
      const { data: classes, error: classesError } = await supabase
        .from('classes')
        .select('id, enrollment_count')
        .eq('tutor_id', tutorId)
        .eq('status', 'active');

      if (classesError) throw classesError;

      // Fetch reviews for ratings
      const { data: reviews, error: reviewsError } = await supabase
        .from('class_reviews')
        .select('rating, created_at, class_id')
        .in('class_id', classes?.map(c => c.id) || []);

      if (reviewsError) throw reviewsError;

      // Fetch enrollments for trends
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('student_enrollments')
        .select('enrollment_date, class_id')
        .in('class_id', classes?.map(c => c.id) || [])
        .eq('status', 'active');

      if (enrollmentsError) throw enrollmentsError;

      // Calculate total students
      const totalStudents = classes?.reduce((sum, c) => sum + (c.enrollment_count || 0), 0) || 0;

      // Calculate average rating
      const averageRating = reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      // Calculate monthly engagement (last 6 months)
      const monthlyEngagement: MonthlyEngagement[] = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const count = enrollments?.filter(e => {
          const enrollDate = new Date(e.enrollment_date);
          return enrollDate >= monthStart && enrollDate <= monthEnd;
        }).length || 0;

        monthlyEngagement.push({ month: monthStr, students: count });
      }

      // Calculate rating trends (last 6 months)
      const ratingTrends: RatingTrend[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthReviews = reviews?.filter(r => {
          const reviewDate = new Date(r.created_at);
          return reviewDate >= monthStart && reviewDate <= monthEnd;
        });

        const avgRating = monthReviews && monthReviews.length > 0
          ? monthReviews.reduce((sum, r) => sum + r.rating, 0) / monthReviews.length
          : 0;

        ratingTrends.push({ month: monthStr, avg_rating: Number(avgRating.toFixed(1)) });
      }

      return {
        monthlyEngagement,
        ratingTrends,
        totalCourses: classes?.length || 0,
        averageRating: Number(averageRating.toFixed(1)),
        totalStudents,
      };
    },
    enabled: !!tutorId,
  });
};
