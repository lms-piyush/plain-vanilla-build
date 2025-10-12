
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "./use-conversations";
import { notificationService } from "@/services/notification-service";

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }

      return messages || [];
    },
    enabled: !!conversationId,
    staleTime: 10 * 1000,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      conversationId, 
      content, 
      recipientId 
    }: { 
      conversationId: string; 
      content: string; 
      recipientId: string; 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Send the message
      const { data: message, error: messageError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          recipient_id: recipientId,
          content: content,
          is_read: false,
        } as any)
        .select()
        .single();

      if (messageError) throw messageError;

      // Send notification to recipient
      try {
        const { data: senderProfile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single();

        if (senderProfile) {
          await notificationService.notifyNewMessage(
            user.id,
            recipientId,
            senderProfile.full_name,
            senderProfile.role as 'student' | 'tutor'
          );
        }
      } catch (notificationError) {
        console.error("Failed to send message notification:", notificationError);
      }

      // Update conversation's last message
      const { error: conversationError } = await supabase
        .from("conversations")
        .update({
          last_message: content,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", conversationId);

      if (conversationError) {
        console.error("Error updating conversation:", conversationError);
      }

      return message;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["student-conversations"] });
      queryClient.invalidateQueries({ queryKey: ["tutor-conversations"] });
    },
  });
};
