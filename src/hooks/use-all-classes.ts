
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAllClasses = () => {
  return useQuery({
    queryKey: ["all-classes"],
    queryFn: async () => {
      console.log("Fetching all classes...");
      
      const { data, error } = await supabase
        .from("classes")
        .select(`
          *,
          tutor:profiles!classes_tutor_id_fkey(full_name),
          class_schedules(*),
          class_time_slots(*)
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching classes:", error);
        throw error;
      }

      console.log("Fetched classes:", data);

      const transformedData = (data || []).map(classItem => ({
        ...classItem,
        tutor_name: (classItem as any).tutor?.full_name || "Unknown Tutor",
        // Handle missing currency field
        currency: classItem.currency || "USD"
      }));

      return transformedData;
    },
  });
};
