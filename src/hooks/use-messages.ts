
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface Conversation {
  id: string;
  student_id: string;
  tutor_id: string;
  class_id: string;
  last_message: string;
  last_message_at: string;
  created_at: string;
  tutor_name?: string;
  class_title?: string;
}

export const useConversations = (studentId: string) => {
  return useQuery({
    queryKey: ["conversations", studentId],
    queryFn: async () => {
      console.log("Fetching conversations for student:", studentId);
      
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          tutor:profiles!conversations_tutor_id_fkey(full_name),
          class:classes(title)
        `)
        .eq("student_id", studentId)
        .order("last_message_at", { ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error);
        throw error;
      }

      console.log("Raw conversations data:", data);

      const transformedData = (data || []).map(conv => ({
        ...conv,
        tutor_name: (conv as any).tutor?.full_name || "Unknown Tutor",
        class_title: (conv as any).class?.title || "Unknown Class"
      }));

      console.log("Transformed conversations:", transformedData);
      return transformedData;
    },
    enabled: !!studentId,
  });
};

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      console.log("Fetching messages for conversation:", conversationId);
      
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }
      
      console.log("Messages data:", data);
      return data || [];
    },
    enabled: !!conversationId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      senderId,
      recipientId,
      content,
    }: {
      conversationId: string;
      senderId: string;
      recipientId: string;
      content: string;
    }) => {
      console.log("Sending message:", { conversationId, senderId, recipientId, content });
      
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          recipient_id: recipientId,
          content,
        })
        .select()
        .single();

      if (error) {
        console.error("Error sending message:", error);
        throw error;
      }

      // Update conversation's last message
      const { error: updateError } = await supabase
        .from("conversations")
        .update({
          last_message: content,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", conversationId);

      if (updateError) {
        console.error("Error updating conversation:", updateError);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studentId,
      tutorId,
      classId,
    }: {
      studentId: string;
      tutorId: string;
      classId: string;
    }) => {
      console.log("Creating conversation:", { studentId, tutorId, classId });
      
      // Check if conversation already exists
      const { data: existing, error: checkError } = await supabase
        .from("conversations")
        .select("id")
        .eq("student_id", studentId)
        .eq("tutor_id", tutorId)
        .eq("class_id", classId)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing conversation:", checkError);
        throw checkError;
      }

      if (existing) {
        console.log("Found existing conversation:", existing);
        return existing;
      }

      // Create new conversation
      const { data, error } = await supabase
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

      if (error) {
        console.error("Error creating conversation:", error);
        throw error;
      }
      
      console.log("Created new conversation:", data);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["conversations", variables.studentId] });
    },
  });
};
