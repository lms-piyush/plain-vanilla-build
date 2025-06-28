
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  enrollment_deadline: string | null;
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
    end_date: string | null;
    frequency: string | null;
    total_sessions: number | null;
  }[];
}

interface UseTutorClassesOptions {
  page?: number;
  pageSize?: number;
}

export const useTutorClasses = (options: UseTutorClassesOptions = {}) => {
  const { page = 1, pageSize = 10 } = options;
  const [classes, setClasses] = useState<TutorClass[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchClasses = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Get total count first
      const { count } = await supabase
        .from("classes")
        .select("*", { count: 'exact', head: true })
        .eq("tutor_id", user.id);

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
            end_date,
            frequency,
            total_sessions
          )
        `)
        .eq("tutor_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

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
  }, [user, page, pageSize]);

  return {
    classes,
    totalCount,
    isLoading,
    error,
    refetch: fetchClasses,
  };
};
