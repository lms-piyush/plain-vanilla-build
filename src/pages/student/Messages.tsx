
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'tutor';
  timestamp: Date;
}

interface Conversation {
  id: string;
  tutorName: string;
  courseName: string;
  lastMessage: string;
  unread: boolean;
  lastMessageTime: string;
  messages: Message[];
  avatarUrl?: string;
  tutorId: string;
}

const Messages = () => {
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      tutorName: "Dr. Alex Johnson",
      courseName: "Advanced Mathematics",
      lastMessage: "When is the next assignment due?",
      unread: true,
      lastMessageTime: "10:32 AM",
      avatarUrl: undefined,
      tutorId: "tutor1",
      messages: [
        {
          id: "m1",
          text: "Hello! I have a question about the calculus problem set.",
          sender: "user",
          timestamp: new Date(2025, 4, 20, 10, 15)
        },
        {
          id: "m2",
          text: "Of course, what specific question are you stuck on?",
          sender: "tutor",
          timestamp: new Date(2025, 4, 20, 10, 17)
        },
        {
          id: "m3",
          text: "I'm having trouble with the integration problems on page 42.",
          sender: "user",
          timestamp: new Date(2025, 4, 20, 10, 20)
        },
        {
          id: "m4",
          text: "Let me help you with that. For integration problems, remember to use the substitution method when you have a function and its derivative.",
          sender: "tutor",
          timestamp: new Date(2025, 4, 20, 10, 25)
        },
        {
          id: "m5",
          text: "Thanks, that helps. When is the next assignment due?",
          sender: "user",
          timestamp: new Date(2025, 4, 20, 10, 32)
        }
      ]
    },
    {
      id: "2",
      tutorName: "Prof. Sarah Williams",
      courseName: "Physics Fundamentals",
      lastMessage: "Your lab report has been graded. Great job!",
      unread: false,
      lastMessageTime: "Yesterday",
      avatarUrl: undefined,
      tutorId: "tutor2",
      messages: [
        {
          id: "m1",
          text: "I've submitted my lab report for review.",
          sender: "user",
          timestamp: new Date(2025, 4, 19, 15, 10)
        },
        {
          id: "m2",
          text: "I'll take a look at it soon.",
          sender: "tutor",
          timestamp: new Date(2025, 4, 19, 16, 20)
        },
        {
          id: "m3",
          text: "Your lab report has been graded. Great job!",
          sender: "tutor",
          timestamp: new Date(2025, 4, 19, 18, 45)
        }
      ]
    },
    {
      id: "3",
      tutorName: "Michael Chen",
      courseName: "Introduction to Computer Science",
      lastMessage: "The debugging technique we discussed should help with your project.",
      unread: false,
      lastMessageTime: "2 days ago",
      avatarUrl: undefined,
      tutorId: "tutor3",
      messages: [
        {
          id: "m1",
          text: "I'm getting a strange error in my code. Can you help?",
          sender: "user",
          timestamp: new Date(2025, 4, 18, 11, 25)
        },
        {
          id: "m2",
          text: "Can you share the error message you're getting?",
          sender: "tutor",
          timestamp: new Date(2025, 4, 18, 11, 40)
        },
        {
          id: "m3",
          text: "It says 'TypeError: Cannot read property 'length' of undefined'",
          sender: "user",
          timestamp: new Date(2025, 4, 18, 11, 45)
        },
        {
          id: "m4",
          text: "That typically means you're trying to access a property on an undefined variable. Try adding a conditional check before accessing the property.",
          sender: "tutor",
          timestamp: new Date(2025, 4, 18, 12, 10)
        },
        {
          id: "m5",
          text: "The debugging technique we discussed should help with your project.",
          sender: "tutor",
          timestamp: new Date(2025, 4, 18, 12, 15)
        }
      ]
    },
  ]);
  
  const [activeConversation, setActiveConversation] = useState<Conversation>(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const newMessageObj: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    const updatedConversation = {
      ...activeConversation,
      lastMessage: newMessage,
      lastMessageTime: "Just now",
      messages: [...activeConversation.messages, newMessageObj]
    };
    
    setActiveConversation(updatedConversation);
    
    const updatedConversations = conversations.map(conv => 
      conv.id === activeConversation.id ? updatedConversation : conv
    );
    
    setConversations(updatedConversations);
    setNewMessage("");
    
    // Simulate tutor response after a delay
    setTimeout(() => {
      const tutorResponse: Message = {
        id: Date.now().toString(),
        text: "Thanks for your message. I'll get back to you soon!",
        sender: 'tutor',
        timestamp: new Date(),
      };
      
      const conversationWithResponse = {
        ...updatedConversation,
        lastMessage: tutorResponse.text,
        lastMessageTime: "Just now",
        messages: [...updatedConversation.messages, tutorResponse]
      };
      
      setActiveConversation(conversationWithResponse);
      
      const finalConversations = conversations.map(conv => 
        conv.id === activeConversation.id ? conversationWithResponse : conv
      );
      
      setConversations(finalConversations);
    }, 2000);
  };
  
  const filteredConversations = conversations.filter(conv => 
    conv.tutorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    conv.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleViewTutorProfile = (tutorId: string) => {
    navigate(`/tutor/${tutorId}`);
  };
  
  return (
    <Layout>
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
                      className={`flex items-start gap-3 p-4 border-b cursor-pointer hover:bg-[#E5D0FF] ${activeConversation.id === conversation.id ? 'bg-[#E5D0FF]' : ''}`}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <Avatar className="cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        handleViewTutorProfile(conversation.tutorId);
                      }}>
                        <AvatarImage src={conversation.avatarUrl} />
                        <AvatarFallback className="bg-[#8A5BB7] text-white">
                          {conversation.tutorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 
                            className="font-medium text-sm truncate cursor-pointer hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewTutorProfile(conversation.tutorId);
                            }}
                          >
                            {conversation.tutorName}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{conversation.lastMessageTime}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{conversation.courseName}</p>
                        <p className="text-sm truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread && (
                        <div className="h-2 w-2 bg-[#8A5BB7] rounded-full self-center"></div>
                      )}
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
                      onClick={() => handleViewTutorProfile(activeConversation.tutorId)}
                    >
                      <AvatarImage src={activeConversation.avatarUrl} />
                      <AvatarFallback className="bg-[#8A5BB7] text-white">
                        {activeConversation.tutorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 
                        className="font-medium cursor-pointer hover:underline"
                        onClick={() => handleViewTutorProfile(activeConversation.tutorId)}
                      >
                        {activeConversation.tutorName}
                      </h2>
                      <p className="text-xs text-muted-foreground">{activeConversation.courseName}</p>
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <ScrollArea className="flex-1">
                  <div className="p-4 flex flex-col gap-4">
                    {activeConversation.messages.map(message => (
                      <div 
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[80%]`}>
                          {message.sender === 'tutor' && (
                            <Avatar className="h-8 w-8 cursor-pointer" onClick={() => handleViewTutorProfile(activeConversation.tutorId)}>
                              <AvatarImage src={activeConversation.avatarUrl} />
                              <AvatarFallback className="bg-[#8A5BB7] text-white text-xs">
                                {activeConversation.tutorName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div className="flex flex-col">
                            <div className={`p-3 rounded-lg text-sm ${
                              message.sender === 'user' 
                                ? 'bg-[#8A5BB7] text-white rounded-tr-none' 
                                : 'bg-gray-100 text-gray-900 rounded-tl-none'
                            }`}>
                              {message.text}
                            </div>
                            <span className={`text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-right mr-2' : 'ml-2'}`}>
                              {formatMessageTime(message.timestamp)}
                            </span>
                          </div>
                          
                          {message.sender === 'user' && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-purple-200 text-[#8A5BB7] text-xs">
                                ME
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>
                    ))}
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
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
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
                  Select a conversation or start a new one with your tutors.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
