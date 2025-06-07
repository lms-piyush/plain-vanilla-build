
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
}

export const useTutorClasses = () => {
  const [classes, setClasses] = useState<TutorClass[]>([]);
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
      const { data, error } = await supabase
        .from("classes")
        .select(`
          *,
          class_locations (
            meeting_link,
            street,
            city,
            state,
            zip_code,
            country
          )
        `)
        .eq("tutor_id", user.id)
        .order("created_at", { ascending: false });

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
  }, [user]);

  return {
    classes,
    isLoading,
    error,
    refetch: fetchClasses,
  };
};
