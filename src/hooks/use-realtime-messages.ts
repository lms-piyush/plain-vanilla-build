
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "./use-conversations";

export const useRealtimeMessages = (conversationId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    console.log("Setting up realtime subscription for conversation:", conversationId);

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          console.log('New message received:', payload);
          
          // Update messages query
          queryClient.setQueryData(['messages', conversationId], (oldMessages: Message[] = []) => {
            const newMessage = payload.new as Message;
            // Check if message already exists to prevent duplicates
            const exists = oldMessages.some(msg => msg.id === newMessage.id);
            if (!exists) {
              return [...oldMessages, newMessage];
            }
            return oldMessages;
          });

          // Update conversation's last message
          queryClient.invalidateQueries({ queryKey: ["student-conversations"] });
          queryClient.invalidateQueries({ queryKey: ["tutor-conversations"] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          console.log('Message updated:', payload);
          
          // Update specific message in the query
          queryClient.setQueryData(['messages', conversationId], (oldMessages: Message[] = []) => {
            return oldMessages.map(msg => 
              msg.id === payload.new.id ? payload.new as Message : msg
            );
          });
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up realtime subscription for conversation:", conversationId);
      supabase.removeChannel(channel);
    };
  }, [conversationId]); // Remove queryClient from deps to prevent multiple subscriptions
};
