
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useConversations } from "@/hooks/use-conversations";
import { useMessages, useSendMessage } from "@/hooks/use-messages";

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const conversationIdFromUrl = searchParams.get('conversation');
  
  const { data: conversations = [], isLoading } = useConversations();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(conversationIdFromUrl);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: messages = [] } = useMessages(activeConversationId || "");
  const sendMessageMutation = useSendMessage();
  
  const activeConversation = conversations.find(conv => conv.id === activeConversationId);
  
  // Set active conversation from URL parameter
  useEffect(() => {
    if (conversationIdFromUrl && conversations.length > 0) {
      setActiveConversationId(conversationIdFromUrl);
    } else if (conversations.length > 0 && !activeConversationId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversationIdFromUrl, conversations, activeConversationId]);
  
  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !activeConversation) return;
    
    try {
      await sendMessageMutation.mutateAsync({
        conversationId: activeConversation.id,
        content: newMessage,
        recipientId: activeConversation.tutor_id,
      });
      
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  const filteredConversations = conversations.filter(conv => 
    conv.tutor_profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatMessageTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleViewTutorProfile = (tutorId: string) => {
    navigate(`/student/tutor/${tutorId}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8A5BB7]"></div>
      </div>
    );
  }
  
  return (
    <>
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
                {filteredConversations.length > 0 ? (
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
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-[#8A5BB7] text-white">
                          {conversation.tutor_profile?.full_name?.charAt(0) || 'T'}
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
                            {conversation.tutor_profile?.full_name || 'Unknown Tutor'}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {formatMessageTime(conversation.last_message_at)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">Class Discussion</p>
                        <p className="text-sm truncate">{conversation.last_message || "Start a conversation..."}</p>
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
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-[#8A5BB7] text-white">
                        {activeConversation.tutor_profile?.full_name?.charAt(0) || 'T'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 
                        className="font-medium cursor-pointer hover:underline"
                        onClick={() => handleViewTutorProfile(activeConversation.tutor_id)}
                      >
                        {activeConversation.tutor_profile?.full_name || 'Unknown Tutor'}
                      </h2>
                      <p className="text-xs text-muted-foreground">Class Discussion</p>
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <ScrollArea className="flex-1">
                  <div className="p-4 flex flex-col gap-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Start the conversation by sending a message!</p>
                      </div>
                    ) : (
                      messages.map(message => (
                        <div 
                          key={message.id}
                          className={`flex ${message.sender_id === activeConversation.student_id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex ${message.sender_id === activeConversation.student_id ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[80%]`}>
                            {message.sender_id === activeConversation.tutor_id && (
                              <Avatar className="h-8 w-8 cursor-pointer" onClick={() => handleViewTutorProfile(activeConversation.tutor_id)}>
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-[#8A5BB7] text-white text-xs">
                                  {activeConversation.tutor_profile?.full_name?.charAt(0) || 'T'}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div className="flex flex-col">
                              <div className={`p-3 rounded-lg text-sm ${
                                message.sender_id === activeConversation.student_id
                                  ? 'bg-[#8A5BB7] text-white rounded-tr-none' 
                                  : 'bg-gray-100 text-gray-900 rounded-tl-none'
                              }`}>
                                {message.content}
                              </div>
                              <span className={`text-xs text-gray-500 mt-1 ${message.sender_id === activeConversation.student_id ? 'text-right mr-2' : 'ml-2'}`}>
                                {formatMessageTime(message.created_at)}
                              </span>
                            </div>
                            
                            {message.sender_id === activeConversation.student_id && (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-purple-200 text-[#8A5BB7] text-xs">
                                  ME
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      ))
                    )}
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
                        if (e.key === 'Enter') handleSendMessage();
                      }}
                      className="flex-1 focus:border-[#8A5BB7] hover:bg-[#E5D0FF]"
                      disabled={sendMessageMutation.isPending}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
                      disabled={sendMessageMutation.isPending}
                    >
                      <Send className="h-4 w-4" />
                      <span className="ml-2 hidden sm:inline">
                        {sendMessageMutation.isPending ? "..." : "Send"}
                      </span>
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
                  Select a conversation or start a new one with your tutors.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
