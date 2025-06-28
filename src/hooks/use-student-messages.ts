
import { useState, useRef, useEffect } from "react";
import { useConversations, useMessages, useSendMessage, useCreateConversation } from "./use-messages";
import { useToast } from "./use-toast";

export const useStudentMessages = (studentId: string) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: conversations = [], isLoading: conversationsLoading } = useConversations(studentId);
  const { data: messages = [], isLoading: messagesLoading } = useMessages(selectedConversation || "");
  const sendMessageMutation = useSendMessage();
  const createConversationMutation = useCreateConversation();

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(
    (conversation) => 
      conversation.tutor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.last_message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;
    
    const activeConversation = conversations.find(c => c.id === selectedConversation);
    if (!activeConversation) return;

    try {
      await sendMessageMutation.mutateAsync({
        conversationId: selectedConversation,
        senderId: studentId,
        recipientId: activeConversation.tutor_id,
        content: messageInput,
      });
      
      setMessageInput("");
      setTimeout(scrollToBottom, 100);
      
      toast({
        title: "Message sent",
        description: "Your message was sent successfully",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle creating a new conversation
  const handleCreateConversation = async (tutorId: string, classId: string) => {
    try {
      const conversation = await createConversationMutation.mutateAsync({
        studentId,
        tutorId,
        classId,
      });
      
      setSelectedConversation(conversation.id);
      
      toast({
        title: "Conversation started",
        description: "You can now message your tutor",
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Auto-scroll when messages change
  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  return {
    // State
    selectedConversation,
    setSelectedConversation,
    messageInput,
    setMessageInput,
    searchTerm,
    setSearchTerm,
    messagesEndRef,
    
    // Data
    conversations: filteredConversations,
    messages,
    
    // Loading states
    conversationsLoading,
    messagesLoading,
    
    // Actions
    handleSendMessage,
    handleCreateConversation,
    scrollToBottom,
    
    // Mutations
    sendMessageMutation,
    createConversationMutation,
  };
};
