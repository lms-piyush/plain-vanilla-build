import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TutorAnalytics {
  totalViews: number;
  totalEnrollments: number;
  conversionRate: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
  classAnalytics: {
    classId: string;
    className: string;
    views: number;
    enrollments: number;
    conversionRate: number;
    revenue: number;
  }[];
  enrollmentTrends: {
    month: string;
    enrollments: number;
  }[];
  revenueTrends: {
    month: string;
    revenue: number;
  }[];
}

async function calculateMonthlyTrends(
  tutorId: string, 
  type: 'enrollments' | 'revenue',
  earnings?: any[]
) {
  const months = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (type === 'enrollments') {
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const { data } = await supabase
        .from('student_enrollments')
        .select('id, class_id, classes!inner(tutor_id)')
        .eq('classes.tutor_id', tutorId)
        .gte('enrollment_date', startOfMonth.toISOString())
        .lte('enrollment_date', endOfMonth.toISOString());

      months.push({
        month: monthName,
        enrollments: data?.length || 0,
      });
    } else {
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const monthRevenue = earnings?.filter(e => {
        const earnedDate = new Date(e.earned_at || e.created_at);
        return earnedDate >= startOfMonth && earnedDate <= endOfMonth;
      }).reduce((sum, e) => sum + Number(e.amount), 0) || 0;

      months.push({
        month: monthName,
        revenue: monthRevenue,
      });
    }
  }
  
  return months;
}

export const useTutorAnalytics = () => {
  const { user } = useAuth();

  return useQuery<TutorAnalytics>({
    queryKey: ['tutor-analytics', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');

      // Fetch all tutor's classes
      const { data: classes, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .eq('tutor_id', user.id);

      if (classesError) throw classesError;

      if (!classes || classes.length === 0) {
        return {
          totalViews: 0,
          totalEnrollments: 0,
          conversionRate: 0,
          totalRevenue: 0,
          monthlyRevenue: 0,
          averageRating: 0,
          totalReviews: 0,
          classAnalytics: [],
          enrollmentTrends: [],
          revenueTrends: [],
        };
      }

      // Calculate totals
      const totalViews = classes.reduce((sum, c) => sum + (c.view_count || 0), 0);
      const totalEnrollments = classes.reduce((sum, c) => sum + (c.enrollment_count || 0), 0);
      const conversionRate = totalViews > 0 ? (totalEnrollments / totalViews) * 100 : 0;

      // Fetch earnings data
      const { data: earnings } = await supabase
        .from('tutor_earnings')
        .select('*')
        .eq('tutor_id', user.id);

      const totalRevenue = earnings?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const monthlyRevenue = earnings?.filter(e => 
        new Date(e.created_at) >= thirtyDaysAgo
      ).reduce((sum, e) => sum + Number(e.amount), 0) || 0;

      // Fetch reviews
      const { data: reviews } = await supabase
        .from('class_reviews')
        .select('rating, class_id')
        .in('class_id', classes.map(c => c.id));

      const averageRating = reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      // Per-class analytics
      const classAnalytics = classes.map(classItem => {
        return {
          classId: classItem.id,
          className: classItem.title,
          views: classItem.view_count || 0,
          enrollments: classItem.enrollment_count || 0,
          conversionRate: (classItem.view_count || 0) > 0 
            ? ((classItem.enrollment_count || 0) / (classItem.view_count || 0)) * 100 
            : 0,
          revenue: earnings?.filter(e => e.class_id === classItem.id)
            .reduce((sum, e) => sum + Number(e.amount), 0) || 0,
        };
      });

      // Trends
      const enrollmentTrends = await calculateMonthlyTrends(user.id, 'enrollments');
      const revenueTrends = await calculateMonthlyTrends(user.id, 'revenue', earnings);

      return {
        totalViews,
        totalEnrollments,
        conversionRate,
        totalRevenue,
        monthlyRevenue,
        averageRating,
        totalReviews: reviews?.length || 0,
        classAnalytics,
        enrollmentTrends,
        revenueTrends,
      };
    },
    enabled: !!user?.id,
  });
};
