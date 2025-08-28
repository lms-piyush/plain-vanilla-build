import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStudentSavedClassesStats = () => {
  return useQuery({
    queryKey: ["student-saved-classes-stats"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { totalSaved: 0 };

      const { data, error } = await supabase
        .from("saved_classes")
        .select("id", { count: "exact" })
        .eq("student_id", user.id);

      if (error) {
        console.error("Error fetching saved classes stats:", error);
        throw error;
      }

      return {
        totalSaved: data?.length || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};