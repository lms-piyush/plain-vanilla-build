
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Conversation {
  id: string;
  student_id: string;
  tutor_id: string;
  class_id: string;
  last_message: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  tutor_profile?: {
    full_name: string;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export const useConversations = () => {
  return useQuery({
    queryKey: ["student-conversations"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // First get conversations
      const { data: conversations, error: conversationsError } = await supabase
        .from("conversations")
        .select("*")
        .eq("student_id", user.id)
        .order("last_message_at", { ascending: false });

      if (conversationsError) {
        console.error("Error fetching conversations:", conversationsError);
        throw conversationsError;
      }

      if (!conversations || conversations.length === 0) {
        return [];
      }

      // Get unique tutor IDs
      const tutorIds = [...new Set(conversations.map(conv => conv.tutor_id))];

      // Fetch tutor profiles
      const { data: tutorProfiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", tutorIds);

      if (profilesError) {
        console.error("Error fetching tutor profiles:", profilesError);
        throw profilesError;
      }

      // Create a map of tutor profiles for easy lookup
      const tutorProfileMap = new Map(
        tutorProfiles?.map(profile => [profile.id, profile]) || []
      );

      // Transform the data to match the expected interface
      const transformedConversations = conversations.map(conv => ({
        ...conv,
        tutor_profile: tutorProfileMap.get(conv.tutor_id) 
          ? { full_name: tutorProfileMap.get(conv.tutor_id)!.full_name }
          : undefined
      }));

      return transformedConversations;
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tutorId, classId }: { tutorId: string; classId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if conversation already exists
      const { data: existingConversation } = await supabase
        .from("conversations")
        .select("*")
        .eq("student_id", user.id)
        .eq("tutor_id", tutorId)
        .eq("class_id", classId)
        .single();

      if (existingConversation) {
        return existingConversation;
      }

      // Create new conversation
      const { data: newConversation, error } = await supabase
        .from("conversations")
        .insert({
          student_id: user.id,
          tutor_id: tutorId,
          class_id: classId,
          last_message: "",
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating conversation:", error);
        throw error;
      }

      return newConversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-conversations"] });
    },
  });
};
