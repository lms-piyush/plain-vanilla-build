
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TutorClass {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  price: number | null;
  currency: string | null;
  max_students: number | null;
  thumbnail_url: string | null;
  status: 'draft' | 'active' | 'inactive' | 'completed';
  delivery_mode: 'online' | 'offline';
  class_format: 'live' | 'recorded' | 'inbound' | 'outbound';
  class_size: 'group' | 'one-on-one';
  duration_type: 'recurring' | 'fixed';
  auto_renewal: boolean | null;
  tutor_id: string;
  tutor_name: string;
  created_at: string;
  updated_at: string;
}

interface UseAllClassesOptions {
  page?: number;
  pageSize?: number;
}

export const useAllClasses = ({ page = 1, pageSize = 9 }: UseAllClassesOptions = {}) => {
  return useQuery({
    queryKey: ["all-classes", page, pageSize],
    queryFn: async () => {
      console.log("Fetching classes with pagination:", { page, pageSize });
      
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;

      // Query to get all active classes with tutor names
      const query = supabase
        .from("classes")
        .select(`
          *,
          profiles (
            full_name
          )
        `, { count: 'exact' })
        .eq("status", "active")
        .order("created_at", { ascending: false });

      // Apply pagination only if pageSize is reasonable (not fetching all)
      const { data: classes, error, count } = pageSize < 1000 
        ? await query.range(startIndex, endIndex)
        : await query;

      if (error) {
        console.error("Error fetching classes:", error);
        throw error;
      }

      console.log("Raw classes data:", classes);
      console.log("Total count:", count);

      // Transform the data to include tutor_name
      const transformedClasses: TutorClass[] = classes?.map(cls => ({
        ...cls,
        tutor_name: cls.profiles?.full_name || "Unknown Tutor"
      })) || [];

      console.log("Transformed classes:", transformedClasses);

      return {
        classes: transformedClasses,
        totalCount: count || 0
      };
    },
    staleTime: 5 * 1000, // Reduced to 5 seconds for better refresh
    gcTime: 15 * 1000, // Reduced garbage collection time
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
