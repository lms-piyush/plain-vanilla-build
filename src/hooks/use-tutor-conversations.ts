
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TutorConversation {
  id: string;
  student_id: string;
  tutor_id: string;
  class_id: string;
  last_message: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  student_profile?: {
    full_name: string;
  };
}

export const useTutorConversations = () => {
  return useQuery({
    queryKey: ["tutor-conversations"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Use JOIN to get conversations with student profiles in a single query
      const { data: conversationsWithProfiles, error } = await supabase
        .from("conversations")
        .select(`
          *,
          profiles!conversations_student_id_fkey(
            id,
            full_name
          )
        `)
        .eq("tutor_id", user.id)
        .order("last_message_at", { ascending: false });

      if (error) {
        console.error("Error fetching tutor conversations with profiles:", error);
        throw error;
      }

      // Transform the data to match the expected interface
      const transformedConversations: TutorConversation[] = conversationsWithProfiles?.map(conv => ({
        ...conv,
        student_profile: conv.profiles ? {
          full_name: conv.profiles.full_name
        } : undefined
      })) || [];

      return transformedConversations;
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};
