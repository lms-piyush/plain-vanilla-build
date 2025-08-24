import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MonthlyEarnings {
  month: string;
  value: number;
  count: number;
}

export interface EarningsStats {
  totalEarnings: number;
  thisMonth: number;
  previousMonth: number;
  thisMonthClasses: { online: number; offline: number };
  previousMonthClasses: { online: number; offline: number };
  monthlyData: MonthlyEarnings[];
}

export const useTutorEarningsStats = () => {
  return useQuery({
    queryKey: ["tutor-earnings-stats"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error("User not authenticated");

      // Get current and previous month dates
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

      // Fetch all classes with enrollments for the tutor
      const { data: classes, error } = await supabase
        .from("classes")
        .select(`
          id,
          title,
          price,
          monthly_charges,
          currency,
          created_at,
          status,
          delivery_mode,
          duration_type,
          batch_number,
          student_enrollments(
            id,
            enrollment_date,
            status,
            batch_number
          )
        `)
        .eq('tutor_id', user.user.id)
        .gte('created_at', oneYearAgo.toISOString());

      if (error) throw error;

      // Calculate earnings from successful enrollments
      let totalEarnings = 0;
      let thisMonth = 0;
      let previousMonthEarnings = 0;
      let thisMonthOnline = 0;
      let thisMonthOffline = 0;
      let previousMonthOnline = 0;
      let previousMonthOffline = 0;
      
      const monthlyData: Record<string, MonthlyEarnings> = {};

      classes?.forEach(cls => {
        const activeEnrollments = cls.student_enrollments?.filter(
          enrollment => enrollment.status === 'active' && 
          enrollment.batch_number === cls.batch_number
        ) || [];

        const classEarning = cls.duration_type === 'recurring' 
          ? (cls.monthly_charges || cls.price || 0)
          : (cls.price || 0);

        activeEnrollments.forEach(enrollment => {
          const enrollmentDate = new Date(enrollment.enrollment_date);
          const monthYear = enrollmentDate.toLocaleDateString('en-US', { 
            month: 'short', 
            year: '2-digit' 
          });

          // Add to monthly data
          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = { month: monthYear, value: 0, count: 0 };
          }
          monthlyData[monthYear].value += classEarning;
          monthlyData[monthYear].count += 1;

          totalEarnings += classEarning;

          // Check if enrollment is in current month
          if (enrollmentDate >= currentMonth) {
            thisMonth += classEarning;
            if (cls.delivery_mode === 'online') thisMonthOnline++;
            else thisMonthOffline++;
          }

          // Check if enrollment is in previous month
          if (enrollmentDate >= previousMonthDate && enrollmentDate < currentMonth) {
            previousMonthEarnings += classEarning;
            if (cls.delivery_mode === 'online') previousMonthOnline++;
            else previousMonthOffline++;
          }
        });
      });

      // Sort monthly data by date
      const sortedMonthlyData = Object.values(monthlyData)
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
        .slice(-12); // Last 12 months

      return {
        totalEarnings,
        thisMonth,
        previousMonth: previousMonthEarnings,
        thisMonthClasses: { online: thisMonthOnline, offline: thisMonthOffline },
        previousMonthClasses: { online: previousMonthOnline, offline: previousMonthOffline },
        monthlyData: sortedMonthlyData
      };
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};