
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useConversations, useMessages, useSendMessage } from "@/hooks/use-messages";
import { useToast } from "@/hooks/use-toast";

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [user, setUser] = useState<any>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user);
      setUser(user);
    };
    getUser();
  }, []);

  // Get conversations
  const { data: conversations = [], isLoading: conversationsLoading, refetch: refetchConversations } = useConversations(user?.id || "");
  
  // Get messages for active conversation
  const { data: messages = [], isLoading: messagesLoading, refetch: refetchMessages } = useMessages(activeConversationId || "");
  
  // Send message mutation
  const sendMessageMutation = useSendMessage();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set up real-time subscriptions for messages
  useEffect(() => {
    if (!user?.id) return;

    console.log("Setting up realtime subscription for user:", user.id);

    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New message received via realtime:', payload);
          toast({
            title: "New message",
            description: "You have received a new message",
          });
          // Refresh messages and conversations
          refetchMessages();
          refetchConversations();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [user?.id, toast, refetchMessages, refetchConversations]);

  // Handle URL params for direct conversation access
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId && conversations.length > 0) {
      const conversationExists = conversations.some(c => c.id === conversationId);
      if (conversationExists) {
        setActiveConversationId(conversationId);
      }
    } else if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [searchParams, conversations, activeConversationId]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !user) return;

    try {
      await sendMessageMutation.mutateAsync({
        conversationId: activeConversation.id,
        senderId: user.id,
        recipientId: activeConversation.tutor_id,
        content: newMessage.trim(),
      });
      setNewMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.tutor_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    conv.class_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleViewTutorProfile = (tutorId: string) => {
    navigate(`/student/tutor/${tutorId}`);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Please log in to view messages</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="flex flex-1 border rounded-lg overflow-hidden h-[calc(100vh-8rem)]">
        {/* Conversations List */}
        <div className="w-full sm:w-1/3 lg:w-1/4 border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Search conversations..." 
                className="pl-10 focus:border-[#8A5BB7] hover:bg-[#E5D0FF]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="h-full">
              {conversationsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <p className="text-muted-foreground">Loading conversations...</p>
                </div>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map(conversation => (
                  <div 
                    key={conversation.id}
                    className={`flex items-start gap-3 p-4 border-b cursor-pointer hover:bg-[#E5D0FF] ${activeConversationId === conversation.id ? 'bg-[#E5D0FF]' : ''}`}
                    onClick={() => setActiveConversationId(conversation.id)}
                  >
                    <Avatar className="cursor-pointer" onClick={(e) => {
                      e.stopPropagation();
                      handleViewTutorProfile(conversation.tutor_id);
                    }}>
                      <AvatarFallback className="bg-[#8A5BB7] text-white">
                        {conversation.tutor_name?.charAt(0) || 'T'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 
                          className="font-medium text-sm truncate cursor-pointer hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTutorProfile(conversation.tutor_id);
                          }}
                        >
                          {conversation.tutor_name}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {formatMessageTime(conversation.last_message_at)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{conversation.class_title}</p>
                      <p className="text-sm truncate">{conversation.last_message || "No messages yet"}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <MessageSquare className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-muted-foreground">No conversations found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Message Thread */}
        <div className="hidden sm:flex sm:flex-col sm:w-2/3 lg:w-3/4">
          {activeConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar 
                    className="cursor-pointer"
                    onClick={() => handleViewTutorProfile(activeConversation.tutor_id)}
                  >
                    <AvatarFallback className="bg-[#8A5BB7] text-white">
                      {activeConversation.tutor_name?.charAt(0) || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 
                      className="font-medium cursor-pointer hover:underline"
                      onClick={() => handleViewTutorProfile(activeConversation.tutor_id)}
                    >
                      {activeConversation.tutor_name}
                    </h2>
                    <p className="text-xs text-muted-foreground">{activeConversation.class_title}</p>
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <ScrollArea className="flex-1">
                <div className="p-4 flex flex-col gap-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center">
                      <p className="text-muted-foreground">Loading messages...</p>
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map(message => (
                      <div 
                        key={message.id}
                        className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex ${message.sender_id === user.id ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[80%]`}>
                          {message.sender_id !== user.id && (
                            <Avatar className="h-8 w-8 cursor-pointer" onClick={() => handleViewTutorProfile(activeConversation.tutor_id)}>
                              <AvatarFallback className="bg-[#8A5BB7] text-white text-xs">
                                {activeConversation.tutor_name?.charAt(0) || 'T'}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className="flex flex-col">
                            <div className={`p-3 rounded-lg text-sm ${
                              message.sender_id === user.id
                                ? 'bg-[#8A5BB7] text-white rounded-tr-none' 
                                : 'bg-gray-100 text-gray-900 rounded-tl-none'
                            }`}>
                              {message.content}
                            </div>
                            <span className={`text-xs text-gray-500 mt-1 ${message.sender_id === user.id ? 'text-right mr-2' : 'ml-2'}`}>
                              {formatMessageTime(message.created_at)}
                            </span>
                          </div>
                          
                          {message.sender_id === user.id && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-purple-200 text-[#8A5BB7] text-xs">
                                ME
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center">
                      <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    placeholder="Type your message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 focus:border-[#8A5BB7] hover:bg-[#E5D0FF]"
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
                    disabled={sendMessageMutation.isPending || !newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">Send</span>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="font-medium text-lg">Your Messages</h2>
              <p className="text-muted-foreground text-center max-w-sm mt-2">
                Select a conversation to start chatting with your tutors.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
