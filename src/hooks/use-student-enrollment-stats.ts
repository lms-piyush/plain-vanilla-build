import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStudentEnrollmentStats = () => {
  return useQuery({
    queryKey: ["student-enrollment-stats"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { totalEnrolled: 0 };

      const { data, error } = await supabase
        .from("student_enrollments")
        .select("id", { count: "exact" })
        .eq("student_id", user.id)
        .eq("status", "active");

      if (error) {
        console.error("Error fetching enrollment stats:", error);
        throw error;
      }

      return {
        totalEnrolled: data?.length || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};