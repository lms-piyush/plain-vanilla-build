
import { KeyboardEvent } from "react";
import { Search, MoreHorizontal, Smile, Paperclip, Send, Circle, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStudentMessages } from "@/hooks/use-student-messages";
import { useAuth } from "@/contexts/AuthContext";

const Messages = () => {
  const { user } = useAuth();
  const studentId = user?.id || "";
  
  const {
    selectedConversation,
    setSelectedConversation,
    messageInput,
    setMessageInput,
    searchTerm,
    setSearchTerm,
    messagesEndRef,
    conversations,
    messages,
    conversationsLoading,
    messagesLoading,
    handleSendMessage,
  } = useStudentMessages(studentId);

  // Handle key press for sending messages
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages: any[]) => {
    const groups: Record<string, any[]> = {};
    
    messages.forEach(message => {
      const date = new Date(message.created_at).toISOString().slice(0, 10);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateStr === today.toISOString().slice(0, 10)) {
      return "Today";
    } else if (dateStr === yesterday.toISOString().slice(0, 10)) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  // Get active conversation info
  const activeConversation = conversations.find(c => c.id === selectedConversation);

  if (conversationsLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Left sidebar with conversations */}
      <div className="w-[320px] border-r flex flex-col bg-gray-50">
        <div className="p-4 border-b bg-white">
          <h2 className="text-lg font-semibold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search chats..." 
              className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Conversation list */}
        <ScrollArea className="flex-1">
          {conversations.length > 0 ? (
            conversations.map((conversation) => (
              <div 
                key={conversation.id} 
                className={`flex items-start gap-3 p-4 hover:bg-gray-100 cursor-pointer border-b transition-colors ${
                  selectedConversation === conversation.id ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-purple-100 text-purple-800">
                    {conversation.tutor_name?.split(" ").map(n => n[0]).join("") || "T"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-900">{conversation.tutor_name}</h3>
                    <span className="text-xs text-gray-500">
                      {new Date(conversation.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs truncate text-gray-500">{conversation.last_message || "No messages yet"}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No conversations yet</div>
          )}
        </ScrollArea>
      </div>

      {/* Right conversation area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedConversation && activeConversation ? (
          <>
            {/* Conversation header */}
            <div className="flex justify-between items-center p-4 border-b bg-white">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-purple-100 text-purple-800">
                    {activeConversation.tutor_name?.split(" ").map(n => n[0]).join("") || "T"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-base font-medium">{activeConversation.tutor_name}</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                      {activeConversation.class_title}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Message area */}
            <ScrollArea className="flex-1 p-4 bg-gray-50">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Loading messages...</p>
                </div>
              ) : (
                <>
                  {Object.keys(groupedMessages).map(date => (
                    <div key={date}>
                      {/* Date divider */}
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t"></span>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-gray-50 px-4 text-xs text-gray-500">{formatDate(date)}</span>
                        </div>
                      </div>

                      {/* Messages for this date */}
                      {groupedMessages[date].map((message) => {
                        const isFromStudent = message.sender_id === studentId;
                        return (
                          <div 
                            key={message.id}
                            className={`mb-6 flex ${isFromStudent ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`flex items-start gap-3 max-w-[85%] ${isFromStudent && "flex-row-reverse"}`}>
                              {!isFromStudent && (
                                <Avatar className="h-8 w-8 mt-1">
                                  <AvatarFallback className="bg-purple-100 text-purple-800">
                                    {activeConversation.tutor_name?.split(" ").map(n => n[0]).join("") || "T"}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              
                              <div className={`flex flex-col ${isFromStudent && "items-end"}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs text-gray-500">
                                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {isFromStudent ? "You" : activeConversation.tutor_name}
                                  </span>
                                </div>
                                
                                <div className={`py-3 px-4 rounded-lg break-words ${
                                  isFromStudent 
                                    ? "bg-purple-600 text-white"
                                    : "bg-white border border-gray-200 text-gray-800"
                                }`}>
                                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                              </div>
                              
                              {isFromStudent && (
                                <Avatar className="h-8 w-8 mt-1">
                                  <AvatarFallback className="bg-purple-200 text-purple-800">
                                    You
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {/* Invisible element to scroll to */}
                  <div ref={messagesEndRef} />
                </>
              )}
            </ScrollArea>

            {/* Message input */}
            <div className="border-t p-4 bg-white">
              <div className="flex items-end gap-2">
                <div className="flex-1 border rounded-lg px-4 py-3 bg-gray-50">
                  <Textarea 
                    placeholder="Type your message..." 
                    className="border-none px-0 py-0 min-h-[40px] focus-visible:ring-0 focus-visible:ring-offset-0 bg-gray-50 resize-none" 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                    <Smile className="h-5 w-5 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                    <Paperclip className="h-5 w-5 text-gray-500" />
                  </Button>
                  <Button 
                    className="rounded-md bg-purple-600 hover:bg-purple-700 gap-2"
                    onClick={handleSendMessage}
                    disabled={messageInput.trim() === ""}
                  >
                    <Send className="h-5 w-5" /> Send
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
