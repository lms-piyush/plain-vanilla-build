import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CourseDistribution {
  notStarted: number;
  ongoing: number;
  completed: number;
}

export const useStudentCourseDistribution = () => {
  return useQuery({
    queryKey: ["student-course-distribution"],
    queryFn: async (): Promise<CourseDistribution> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { notStarted: 0, ongoing: 0, completed: 0 };

      // Get enrolled classes with their schedules and current status
      const { data: enrollments, error } = await supabase
        .from("student_enrollments")
        .select(`
          class_id,
          classes!inner(
            id,
            status,
            class_schedules(
              start_date,
              end_date
            )
          )
        `)
        .eq("student_id", user.id)
        .eq("status", "active");

      if (error) {
        console.error("Error fetching course distribution:", error);
        throw error;
      }

      if (!enrollments) return { notStarted: 0, ongoing: 0, completed: 0 };

      const currentDate = new Date();
      const today = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      let notStarted = 0;
      let ongoing = 0;
      let completed = 0;

      enrollments.forEach((enrollment: any) => {
        const classData = enrollment.classes;
        const schedule = classData?.class_schedules?.[0];

        if (classData?.status === 'completed') {
          completed++;
        } else if (classData?.status === 'running' || 
                  (schedule?.start_date && schedule.start_date <= today && 
                   schedule?.end_date && schedule.end_date >= today)) {
          ongoing++;
        } else if (classData?.status === 'active' || 
                  (schedule?.start_date && schedule.start_date > today)) {
          notStarted++;
        } else {
          // Default to not started if status is unclear
          notStarted++;
        }
      });

      return { notStarted, ongoing, completed };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};