
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useConversationManagement = () => {
  const queryClient = useQueryClient();

  const findOrCreateConversation = useMutation({
    mutationFn: async ({ 
      tutorId, 
      studentId, 
      classId 
    }: { 
      tutorId: string; 
      studentId: string; 
      classId: string; 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if conversation already exists between participants
      const { data: existingConversation, error: searchError } = await supabase
        .from("conversations")
        .select("*")
        .or(`and(participant1_id.eq.${studentId},participant2_id.eq.${tutorId}),and(participant1_id.eq.${tutorId},participant2_id.eq.${studentId})`)
        .eq("class_id", classId)
        .maybeSingle();

      if (searchError) {
        console.error("Error searching for existing conversation:", searchError);
        throw searchError;
      }

      if (existingConversation) {
        console.log("Found existing conversation:", existingConversation.id);
        return existingConversation;
      }

      // Create new conversation if none exists
      const { data: newConversation, error: createError } = await supabase
        .from("conversations")
        .insert({
          participant1_id: studentId,
          participant2_id: tutorId,
          class_id: classId,
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating conversation:", createError);
        throw createError;
      }

      console.log("Created new conversation:", newConversation.id);
      return newConversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-conversations"] });
      queryClient.invalidateQueries({ queryKey: ["tutor-conversations"] });
    },
  });

  return { findOrCreateConversation };
};
