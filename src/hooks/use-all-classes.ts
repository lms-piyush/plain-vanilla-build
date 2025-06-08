
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TutorClass {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  delivery_mode: 'online' | 'offline';
  class_format: 'live' | 'recorded' | 'inbound' | 'outbound';
  class_size: 'group' | 'one-on-one';
  duration_type: 'recurring' | 'fixed';
  status: 'draft' | 'active' | 'inactive' | 'completed';
  price: number | null;
  currency: string | null;
  max_students: number | null;
  auto_renewal: boolean | null;
  thumbnail_url: string | null;
  tutor_id: string;
  created_at: string;
  updated_at: string;
  class_locations?: {
    meeting_link: string | null;
    street: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    country: string | null;
  }[];
  class_time_slots?: {
    id: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
  }[];
  class_schedules?: {
    id: string;
    start_date: string | null;
    total_sessions: number | null;
  }[];
}

interface UseAllClassesOptions {
  page?: number;
  pageSize?: number;
}

export const useAllClasses = (options: UseAllClassesOptions = {}) => {
  const { page = 1, pageSize = 9 } = options;
  const [classes, setClasses] = useState<TutorClass[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching classes with options:", { page, pageSize });
      
      // First check if there are any classes at all (regardless of status)
      const { data: allClassesData, error: allClassesError } = await supabase
        .from("classes")
        .select("id, status, tutor_id")
        .limit(5);
      
      console.log("All classes in database:", allClassesData);
      console.log("Error fetching all classes:", allClassesError);
      
      // Get total count first for active classes only
      const { count, error: countError } = await supabase
        .from("classes")
        .select("*", { count: 'exact', head: true })
        .eq("status", "active");

      console.log("Active classes count:", count);
      console.log("Count error:", countError);

      setTotalCount(count || 0);

      // Get paginated data with explicit foreign key relationship names
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await supabase
        .from("classes")
        .select(`
          *,
          class_locations!class_locations_class_id_fkey (
            meeting_link,
            street,
            city,
            state,
            zip_code,
            country
          ),
          class_time_slots!class_time_slots_class_id_fkey (
            id,
            day_of_week,
            start_time,
            end_time
          ),
          class_schedules!class_schedules_class_id_fkey (
            id,
            start_date,
            total_sessions
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .range(from, to);

      console.log("Fetched active classes:", data);
      console.log("Fetch error:", error);

      if (error) throw error;

      setClasses(data || []);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching classes:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [page, pageSize]);

  return {
    classes,
    totalCount,
    isLoading,
    error,
    refetch: fetchClasses,
  };
};
