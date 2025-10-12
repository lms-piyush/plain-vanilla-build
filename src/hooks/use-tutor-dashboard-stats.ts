import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TutorDashboardStats {
  totalClasses: number;
  todaysSessions: number;
  totalStudents: number;
  monthlyRevenue: number;
  unreadMessages: number;
  averageRating: number;
  totalReviews: number;
  previousMonthRevenue: number;
  studentGrowth: number;
}

export const useTutorDashboardStats = () => {
  return useQuery({
    queryKey: ["tutor-dashboard-stats"],
    queryFn: async (): Promise<TutorDashboardStats> => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error("User not authenticated");

      const tutorId = user.user.id;
      const today = new Date();
      const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

      // 1. Total Classes Count
      const { count: totalClasses } = await supabase
        .from("classes")
        .select("*", { count: 'exact', head: true })
        .eq('tutor_id', tutorId);

      // 2. Today's Sessions Count - using JOIN approach
      const { data: todaysSessionsData } = await supabase
        .from("class_syllabus")
        .select(`
          id,
          classes!inner(tutor_id)
        `)
        .eq('session_date', today.toISOString().split('T')[0])
        .eq('classes.tutor_id', tutorId);

      const todaysSessions = todaysSessionsData?.length || 0;

      // 3. Total Students Count (active enrollments) - using JOIN approach
      const { data: studentsData } = await supabase
        .from("student_enrollments")
        .select(`
          student_id,
          classes!inner(tutor_id)
        `)
        .eq('status', 'active')
        .eq('classes.tutor_id', tutorId);

      const totalStudents = studentsData?.length || 0;

      // 4. Monthly Revenue (current and previous month)
      const { data: enrollments } = await supabase
        .from("student_enrollments")
        .select(`
          enrollment_date,
          classes!inner(
            id,
            tutor_id,
            price,
            monthly_charges,
            duration_type,
            currency
          )
        `)
        .eq('classes.tutor_id', tutorId)
        .eq('status', 'active')
        .gte('enrollment_date', previousMonth.toISOString());

      let monthlyRevenue = 0;
      let previousMonthRevenue = 0;

      enrollments?.forEach((enrollment: any) => {
        const enrollmentDate = new Date(enrollment.enrollment_date);
        const revenue = enrollment.classes?.duration_type === 'recurring' 
          ? (enrollment.classes?.monthly_charges || enrollment.classes?.price || 0)
          : (enrollment.classes?.price || 0);

        if (enrollmentDate >= currentMonth) {
          monthlyRevenue += Number(revenue);
        } else if (enrollmentDate >= previousMonth && enrollmentDate < currentMonth) {
          previousMonthRevenue += Number(revenue);
        }
      });

      // 5. Unread Messages Count
      const { count: unreadMessages } = await supabase
        .from("messages")
        .select("*", { count: 'exact', head: true })
        .eq('recipient_id', tutorId)
        .eq('is_read', false);

      // 6. Average Rating from class reviews and tutor reviews
      const { data: classReviews } = await supabase
        .from("class_reviews")
        .select(`
          rating,
          classes!inner(tutor_id)
        `)
        .eq('classes.tutor_id', tutorId);

      const { data: tutorReviews } = await supabase
        .from("tutor_reviews")
        .select("rating")
        .eq('tutor_id', tutorId);

      const allRatings = [
        ...(classReviews || []).map(r => r.rating),
        ...(tutorReviews || []).map(r => r.rating)
      ];

      const averageRating = allRatings.length > 0 
        ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
        : 0;

      // Calculate student growth percentage
      const studentGrowth = previousMonthRevenue > 0 
        ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
        : 0;

      return {
        totalClasses: totalClasses || 0,
        todaysSessions,
        totalStudents,
        monthlyRevenue,
        unreadMessages: unreadMessages || 0,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: allRatings.length,
        previousMonthRevenue,
        studentGrowth
      };
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};