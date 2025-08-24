import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TutorEarningsClass {
  id: string;
  title: string;
  class_format: 'live' | 'recorded' | 'inbound' | 'outbound';
  class_size: 'group' | 'one-on-one';
  duration_type: 'recurring' | 'fixed';
  amount: number;
  currency: string;
  created_at: string;
  status: 'draft' | 'active' | 'inactive' | 'completed' | 'running';
  delivery_mode: 'online' | 'offline';
  student_count: number;
}

interface UseTutorEarningsClassesParams {
  deliveryMode?: 'online' | 'offline' | null;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const useTutorEarningsClasses = ({
  deliveryMode,
  sortBy = 'created_at',
  sortOrder = 'desc',
  page = 1,
  pageSize = 10
}: UseTutorEarningsClassesParams = {}) => {
  return useQuery({
    queryKey: ["tutor-earnings-classes", deliveryMode, sortBy, sortOrder, page, pageSize],
    queryFn: async () => {
      console.log("Fetching tutor earnings classes with filters:", {
        deliveryMode,
        sortBy,
        sortOrder,
        page,
        pageSize
      });

      // Start building the query - filter by current tutor's classes
      let query = supabase
        .from("classes")
        .select(`
          id,
          title,
          class_format,
          class_size,
          duration_type,
          price,
          monthly_charges,
          currency,
          created_at,
          status,
          delivery_mode,
          batch_number,
          tutor_id
        `, { count: 'exact' })
        .eq('tutor_id', (await supabase.auth.getUser()).data.user?.id);

      // Apply delivery mode filter
      if (deliveryMode) {
        query = query.eq('delivery_mode', deliveryMode);
      }

      // Apply sorting - handle special cases for amount and computed fields
      if (sortBy === 'amount') {
        // For amount sorting, we'll sort by monthly_charges if it exists, otherwise price
        query = query.order('monthly_charges', { ascending: sortOrder === 'asc', nullsFirst: false })
                     .order('price', { ascending: sortOrder === 'asc', nullsFirst: false });
      } else {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      }

      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize - 1;
      query = query.range(startIndex, endIndex);

      const { data: classes, error, count } = await query;

      if (error) {
        console.error("Error fetching tutor earnings classes:", error);
        throw error;
      }

      console.log("Raw classes data:", classes);

      // Get student counts for each class (latest batch)
      const classIds = classes?.map(c => c.id) || [];
      let studentCounts: Record<string, number> = {};

      if (classIds.length > 0) {
        const { data: enrollments } = await supabase
          .from('student_enrollments')
          .select('class_id, batch_number')
          .in('class_id', classIds);

        // Group by class_id and batch_number, then count
        const enrollmentCounts = enrollments?.reduce((acc, enrollment) => {
          const key = `${enrollment.class_id}-${enrollment.batch_number}`;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        // Map to class_id with latest batch
        classes?.forEach(cls => {
          const key = `${cls.id}-${cls.batch_number}`;
          studentCounts[cls.id] = enrollmentCounts[key] || 0;
        });
      }

      // Transform the data to include computed amount and student_count
      const transformedClasses: TutorEarningsClass[] = classes?.map(cls => ({
        id: cls.id,
        title: cls.title,
        class_format: cls.class_format,
        class_size: cls.class_size,
        duration_type: cls.duration_type,
        amount: cls.duration_type === 'recurring' 
          ? (cls.monthly_charges || cls.price || 0)
          : (cls.price || 0),
        currency: cls.currency || 'INR',
        created_at: cls.created_at,
        status: cls.status,
        delivery_mode: cls.delivery_mode,
        student_count: studentCounts[cls.id] || 0
      })) || [];

      console.log("Transformed classes:", transformedClasses);

      return {
        classes: transformedClasses,
        totalCount: count || 0
      };
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};