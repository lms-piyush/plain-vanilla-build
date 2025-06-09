
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StudentEnrollment {
  id: string;
  student_id: string;
  class_id: string;
  enrollment_date: string;
  status: 'active' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
  class: {
    id: string;
    title: string;
    description: string | null;
    subject: string | null;
    price: number | null;
    thumbnail_url: string | null;
    status: 'draft' | 'active' | 'inactive' | 'completed';
    delivery_mode: 'online' | 'offline';
    class_format: 'live' | 'recorded' | 'inbound' | 'outbound';
    class_size: 'group' | 'one-on-one';
    duration_type: 'recurring' | 'fixed';
    tutor_id: string;
    tutor_name: string;
  };
}

export const useStudentEnrollments = () => {
  return useQuery({
    queryKey: ["student-enrollments"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Improved query with proper inner join to ensure we get tutor names
      const { data: enrollments, error } = await supabase
        .from("student_enrollments")
        .select(`
          *,
          classes!inner (
            id,
            title,
            description,
            subject,
            price,
            thumbnail_url,
            status,
            delivery_mode,
            class_format,
            class_size,
            duration_type,
            tutor_id,
            profiles!inner (
              full_name
            )
          )
        `)
        .eq("student_id", user.id)
        .order("enrollment_date", { ascending: false });

      if (error) {
        console.error("Error fetching enrollments:", error);
        throw error;
      }

      // Transform the data to match our interface
      const transformedEnrollments: StudentEnrollment[] = enrollments?.map(enrollment => ({
        ...enrollment,
        status: enrollment.status as 'active' | 'completed' | 'cancelled',
        payment_status: enrollment.payment_status as 'pending' | 'paid' | 'failed' | 'refunded',
        class: {
          ...enrollment.classes,
          tutor_name: enrollment.classes?.profiles?.full_name || "Unknown Tutor"
        }
      })) || [];

      console.log("Fetched enrollments with tutor names:", transformedEnrollments);

      return transformedEnrollments;
    },
    staleTime: 30 * 1000, // Reduced from 5 minutes to 30 seconds
    refetchInterval: 60 * 1000, // Auto-refetch every minute
  });
};
