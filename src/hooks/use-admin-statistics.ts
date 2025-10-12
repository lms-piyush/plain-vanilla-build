import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminStatistics = () => {
  return useQuery({
    queryKey: ['admin-statistics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_statistics');
      
      if (error) throw error;
      
      return data?.[0] || {
        total_students: 0,
        total_tutors: 0,
        total_classes: 0,
        active_classes: 0,
        total_enrollments: 0,
        active_enrollments: 0,
        total_revenue: 0
      };
    }
  });
};

export const usePlatformGrowth = () => {
  return useQuery({
    queryKey: ['platform-growth'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_platform_growth');
      
      if (error) throw error;
      
      return data || [];
    }
  });
};
