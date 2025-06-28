
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

      // First get conversations for tutor
      const { data: conversations, error: conversationsError } = await supabase
        .from("conversations")
        .select("*")
        .eq("tutor_id", user.id)
        .order("last_message_at", { ascending: false });

      if (conversationsError) {
        console.error("Error fetching tutor conversations:", conversationsError);
        throw conversationsError;
      }

      if (!conversations || conversations.length === 0) {
        return [];
      }

      // Get unique student IDs
      const studentIds = [...new Set(conversations.map(conv => conv.student_id))];

      // Fetch student profiles
      const { data: studentProfiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", studentIds);

      if (profilesError) {
        console.error("Error fetching student profiles:", profilesError);
        throw profilesError;
      }

      // Create a map of student profiles for easy lookup
      const studentProfileMap = new Map(
        studentProfiles?.map(profile => [profile.id, profile]) || []
      );

      // Transform the data to match the expected interface
      const transformedConversations = conversations.map(conv => ({
        ...conv,
        student_profile: studentProfileMap.get(conv.student_id) 
          ? { full_name: studentProfileMap.get(conv.student_id)!.full_name }
          : undefined
      }));

      return transformedConversations;
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};
