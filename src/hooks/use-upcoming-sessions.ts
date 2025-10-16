import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUpcomingSessions = () => {
  const { user } = useAuth();

  const { data: sessions = [], isLoading, error } = useQuery({
    queryKey: ['upcoming-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('class_syllabus')
        .select(`
          id,
          session_date,
          start_time,
          end_time,
          title,
          class_id,
          class:classes!inner(
            id,
            title,
            delivery_mode,
            class_locations(meeting_link, street, city, state)
          )
        `)
        .gte('session_date', today)
        .eq('class.student_enrollments.student_id', user.id)
        .eq('class.student_enrollments.status', 'active')
        .order('session_date', { ascending: true })
        .order('start_time', { ascending: true })
        .limit(10);

      if (error) throw error;

      return data?.map((session: any) => ({
        id: session.id,
        class_id: session.class_id,
        class_title: session.class?.title || 'Unknown Class',
        session_date: session.session_date,
        start_time: session.start_time,
        end_time: session.end_time,
        delivery_mode: session.class?.delivery_mode || 'online',
        meeting_link: session.class?.class_locations?.[0]?.meeting_link,
        location: session.class?.class_locations?.[0]
          ? `${session.class.class_locations[0].street}, ${session.class.class_locations[0].city}, ${session.class.class_locations[0].state}`
          : undefined,
      })) || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    sessions,
    isLoading,
    error,
  };
};
