import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ParentStats {
  totalChildren: number;
  activeClasses: number;
  upcomingSessions: number;
  monthlySpending: number;
  totalSpending: number;
  childrenEnrollments: {
    childId: string;
    childName: string;
    enrollmentCount: number;
    activeClasses: number;
  }[];
}

export const useParentStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["parent-stats", user?.id],
    queryFn: async (): Promise<ParentStats> => {
      if (!user?.id) throw new Error("User not authenticated");

      // Get all children
      const { data: children, error: childrenError } = await supabase
        .from("children")
        .select("id, name")
        .eq("parent_id", user.id);

      if (childrenError) throw childrenError;

      const childIds = children?.map(c => c.id) || [];
      const today = new Date();
      const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Get all enrollments for all children
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from("student_enrollments")
        .select(`
          id,
          child_id,
          status,
          enrollment_date,
          classes!inner(
            id,
            title,
            price,
            monthly_charges,
            duration_type,
            class_schedules(start_date, end_date),
            class_syllabus(session_date, status)
          )
        `)
        .in("child_id", childIds.length > 0 ? childIds : ['00000000-0000-0000-0000-000000000000']);

      if (enrollmentsError) throw enrollmentsError;

      // Calculate stats
      const activeEnrollments = enrollments?.filter(e => e.status === 'active') || [];
      const activeClasses = activeEnrollments.length;

      // Calculate upcoming sessions (this week)
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      let upcomingSessions = 0;
      activeEnrollments.forEach((enrollment: any) => {
        const syllabusItems = enrollment.classes?.class_syllabus || [];
        syllabusItems.forEach((session: any) => {
          if (session.session_date) {
            const sessionDate = new Date(session.session_date);
            if (sessionDate >= today && sessionDate <= nextWeek && session.status !== 'completed') {
              upcomingSessions++;
            }
          }
        });
      });

      // Calculate monthly spending
      let monthlySpending = 0;
      let totalSpending = 0;

      enrollments?.forEach((enrollment: any) => {
        const enrollmentDate = new Date(enrollment.enrollment_date);
        const classData = enrollment.classes;
        
        if (!classData) return;

        const amount = classData.duration_type === 'recurring' 
          ? (classData.monthly_charges || classData.price || 0)
          : (classData.price || 0);

        totalSpending += Number(amount);

        if (enrollmentDate >= currentMonth && enrollment.status === 'active') {
          monthlySpending += Number(amount);
        }
      });

      // Calculate per-child enrollments
      const childrenEnrollments = children?.map(child => {
        const childEnrollments = enrollments?.filter(e => e.child_id === child.id) || [];
        const activeChildEnrollments = childEnrollments.filter(e => e.status === 'active');
        
        return {
          childId: child.id,
          childName: child.name,
          enrollmentCount: childEnrollments.length,
          activeClasses: activeChildEnrollments.length,
        };
      }) || [];

      return {
        totalChildren: children?.length || 0,
        activeClasses,
        upcomingSessions,
        monthlySpending,
        totalSpending,
        childrenEnrollments,
      };
    },
    enabled: !!user?.id && user?.role === "parent",
    staleTime: 30 * 1000, // 30 seconds
  });
};