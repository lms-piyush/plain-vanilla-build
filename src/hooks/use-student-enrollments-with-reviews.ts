
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StudentEnrollmentWithReviews {
  id: string;
  student_id: string;
  class_id: string;
  batch_number: number;
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
    status: 'draft' | 'active' | 'inactive' | 'completed' | 'running';
    delivery_mode: 'online' | 'offline';
    class_format: 'live' | 'recorded' | 'inbound' | 'outbound';
    class_size: 'group' | 'one-on-one';
    duration_type: 'recurring' | 'fixed';
    max_students: number | null;
    currency: string | null;
    batch_number: number;
    tutor_id: string;
    tutor_name: string;
    average_rating: number;
    total_reviews: number;
    student_count: number;
    created_at: string;
    updated_at: string;
    is_current_batch: boolean;
    class_schedules: {
      id: string;
      start_date: string | null;
      end_date: string | null;
      frequency: string | null;
      total_sessions: number | null;
    }[];
    class_time_slots: {
      id: string;
      day_of_week: string;
      start_time: string;
      end_time: string;
    }[];
  };
}

export const useStudentEnrollmentsWithReviews = () => {
  return useQuery({
    queryKey: ["student-enrollments-with-reviews"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No authenticated user found");
        return [];
      }

      console.log("Fetching enrollments with comprehensive class data for user:", user.id);

      const { data: enrollments, error } = await supabase
        .from("student_enrollments")
        .select(`
          *,
          classes!inner (
            *,
            profiles!classes_tutor_id_fkey (
              full_name
            ),
            class_reviews(rating),
            student_enrollments(id),
            class_time_slots (
              id,
              day_of_week,
              start_time,
              end_time
            ),
            class_schedules (
              id,
              start_date,
              end_date,
              frequency,
              total_sessions
            )
          )
        `)
        .eq("student_id", user.id)
        .order("enrollment_date", { ascending: false });

      if (error) {
        console.error("Error fetching enrollments with reviews:", error);
        throw error;
      }

      console.log("Raw enrollments data:", enrollments);

      // Get latest batch numbers for all classes to determine if student is enrolled in current batch
      const classIds = enrollments?.map(e => e.class_id) || [];
      const { data: latestBatches } = await supabase
        .from("classes")
        .select("id, batch_number")
        .in("id", classIds)
        .order("batch_number", { ascending: false });

      const latestBatchMap = new Map<string, number>();
      latestBatches?.forEach(batch => {
        if (!latestBatchMap.has(batch.id) || batch.batch_number > latestBatchMap.get(batch.id)!) {
          latestBatchMap.set(batch.id, batch.batch_number);
        }
      });

      const transformedEnrollments: StudentEnrollmentWithReviews[] = enrollments?.map(enrollment => {
        const classData = enrollment.classes;
        const reviews = classData?.class_reviews || [];
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 
          ? Math.round((reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews) * 10) / 10
          : 0;

        const studentCount = classData?.student_enrollments?.length || 0;
        const latestBatch = latestBatchMap.get(classData.id) || 1;
        const isCurrentBatch = enrollment.batch_number === latestBatch;

        return {
          ...enrollment,
          status: enrollment.status as 'active' | 'completed' | 'cancelled',
          payment_status: enrollment.payment_status as 'pending' | 'paid' | 'failed' | 'refunded',
          class: {
            ...classData,
            tutor_name: classData?.profiles?.full_name || "Unknown Tutor",
            average_rating: averageRating,
            total_reviews: totalReviews,
            student_count: studentCount,
            is_current_batch: isCurrentBatch
          }
        };
      }) || [];

      console.log("Transformed enrollments with comprehensive data:", transformedEnrollments);

      return transformedEnrollments;
    },
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 30 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
