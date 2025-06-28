
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

      // Check if conversation already exists between student and tutor
      const { data: existingConversation, error: searchError } = await supabase
        .from("conversations")
        .select("*")
        .eq("student_id", studentId)
        .eq("tutor_id", tutorId)
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
          student_id: studentId,
          tutor_id: tutorId,
          class_id: classId,
          last_message: "",
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
