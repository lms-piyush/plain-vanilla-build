import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useRecentlyViewedClasses = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch recently viewed classes
  const { data: recentlyViewed = [], isLoading } = useQuery({
    queryKey: ['recently-viewed-classes', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('recently_viewed_classes')
        .select(`
          *,
          class:classes(
            id,
            title,
            description,
            thumbnail_url,
            price,
            delivery_mode,
            class_format,
            tutor_id,
            subject
          )
        `)
        .eq('student_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Add or update recently viewed class
  const trackViewMutation = useMutation({
    mutationFn: async (classId: string) => {
      if (!user) return;

      // Upsert: insert or update viewed_at timestamp
      const { error } = await supabase
        .from('recently_viewed_classes')
        .upsert(
          {
            student_id: user.id,
            class_id: classId,
            viewed_at: new Date().toISOString(),
          },
          {
            onConflict: 'student_id,class_id',
          }
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recently-viewed-classes'] });
    },
  });

  const trackView = (classId: string) => {
    trackViewMutation.mutate(classId);
  };

  return {
    recentlyViewed,
    isLoading,
    trackView,
  };
};
