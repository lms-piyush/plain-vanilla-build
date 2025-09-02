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

export interface TutorAnalytics {
  monthlyEngagement: MonthlyEngagement[];
  ratingTrends: RatingTrend[];
}

export const useTutorAnalytics = (tutorId: string) => {
  return useQuery({
    queryKey: ["tutor-analytics", tutorId],
    queryFn: async (): Promise<TutorAnalytics> => {
      if (!tutorId) {
        return {
          monthlyEngagement: [],
          ratingTrends: []
        };
      }

      // Fetch monthly engagement data (server-side filtering)
      const { data: engagementData, error: engagementError } = await supabase
        .from("tutor_monthly_engagement")
        .select("month_start, enrollments_count")
        .eq("tutor_id", tutorId)
        .order("month_start", { ascending: true });

      if (engagementError) {
        console.error("Error fetching engagement data:", engagementError);
        throw engagementError;
      }

      // Fetch rating trends data (server-side filtering)
      const { data: ratingData, error: ratingError } = await supabase
        .from("tutor_rating_trends")
        .select("month_start, avg_rating")
        .eq("tutor_id", tutorId)
        .order("month_start", { ascending: true });

      if (ratingError) {
        console.error("Error fetching rating trends:", ratingError);
        throw ratingError;
      }

      // Transform engagement data to chart format
      const monthlyEngagement: MonthlyEngagement[] = (engagementData || []).map(item => ({
        month: new Date(item.month_start).toLocaleDateString('en-US', { month: 'short' }),
        students: item.enrollments_count
      }));

      // Transform rating data to chart format
      const ratingTrends: RatingTrend[] = (ratingData || []).map(item => ({
        month: new Date(item.month_start).toLocaleDateString('en-US', { month: 'short' }),
        avg_rating: parseFloat(item.avg_rating.toString())
      }));

      return {
        monthlyEngagement,
        ratingTrends
      };
    },
    enabled: !!tutorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};