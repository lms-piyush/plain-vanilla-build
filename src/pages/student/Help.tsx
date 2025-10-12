
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Loader2 } from "lucide-react";
import { useSupportTickets } from "@/hooks/use-support-tickets";
import { useFAQs } from "@/hooks/use-faqs";
import { useVideoTutorials } from "@/hooks/use-video-tutorials";
import { useAuth } from "@/contexts/AuthContext";

const Help = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFAQCategory, setSelectedFAQCategory] = useState<'general' | 'classes' | 'billing'>('general');
  
  // Check authentication
  const { user, isAuthenticated } = useAuth();
  
  // Use hooks for database operations
  const { tickets, isLoading: ticketsLoading, isCreating, createTicket } = useSupportTickets();
  const { faqs, isLoading: faqsLoading } = useFAQs(selectedFAQCategory);
  const { tutorials, isLoading: tutorialsLoading, openVideo, getYouTubeThumbnail } = useVideoTutorials();

  console.log('Help component - Auth state:', { user: !!user, isAuthenticated });
  console.log('Help component - Tickets:', tickets?.length || 0);
  console.log('Help component - FAQs:', faqs?.length || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (subject && message) {
      createTicket({ subject, message });
      
      // Show modal
      setIsModalOpen(true);
      
      // Auto close after 5 seconds
      setTimeout(() => {
        setIsModalOpen(false);
      }, 5000);
      
      // Reset form
      setSubject("");
      setMessage("");
    } else {
      toast({
        title: "Error",
        description: "Please fill in both fields.",
        variant: "destructive"
      });
    }
  };

  const faqCategories = [
    { id: "general", name: "General" },
    { id: "classes", name: "Classes" },
    { id: "billing", name: "Billing" }
  ];

  return (
    <>
      {/* Banner Section */}
      <div className="mb-6 bg-gradient-to-r from-[#8A5BB7] to-[#BA8DF1] rounded-lg p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 md:mr-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to our Help Center</h1>
            <p className="text-lg opacity-90">
              Find answers to common questions or submit a support ticket. We're here to help you succeed!
            </p>
          </div>
          <div className="flex-shrink-0 bg-white/20 p-4 rounded-full">
            <HelpCircle size={80} className="text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Issue Submission Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input 
                  id="subject" 
                  placeholder="Enter the subject" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Describe your issue or question"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Submitted Issues Table */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left font-medium">Issue Title</th>
                    <th className="py-2 px-4 text-left font-medium">Issue Description</th>
                    <th className="py-2 px-4 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsLoading ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-center">
                        <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                      </td>
                    </tr>
                  ) : tickets.length > 0 ? (
                    tickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b">
                        <td className="py-3 px-4">{ticket.subject}</td>
                        <td className="py-3 px-4 max-w-xs truncate">{ticket.message}</td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={ticket.status === "resolved" ? "default" : "secondary"}
                            className={
                              ticket.status === "resolved" 
                                ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }
                          >
                            {ticket.status === "resolved" ? "Resolved" : "In Progress"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-muted-foreground">
                        No support tickets found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQs Section with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={selectedFAQCategory} 
            onValueChange={(value) => setSelectedFAQCategory(value as 'general' | 'classes' | 'billing')}
          >
            <TabsList className="mb-6">
              {faqCategories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {faqCategories.map(category => (
              <TabsContent key={category.id} value={category.id}>
                {faqsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          {faq.title}
                        </AccordionTrigger>
                        <AccordionContent>{faq.description}</AccordionContent>
                      </AccordionItem>
                    ))}
                    {faqs.length === 0 && (
                      <div className="py-8 text-center text-muted-foreground">
                        No FAQs found for this category.
                      </div>
                    )}
                  </Accordion>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Video Tutorials Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Video Tutorials</CardTitle>
        </CardHeader>
        <CardContent>
          {tutorialsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tutorials.map((tutorial) => (
                <div 
                  key={tutorial.id} 
                  className="rounded-lg border p-3 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => openVideo(tutorial.url)}
                >
                  <div className="aspect-video bg-muted rounded-md mb-2 relative overflow-hidden">
                    <img 
                      src={tutorial.thumbnail_url || getYouTubeThumbnail(tutorial.url)}
                      alt={tutorial.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm mb-1">{tutorial.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {tutorial.description}
                  </p>
                </div>
              ))}
              {tutorials.length === 0 && (
                <div className="col-span-full py-8 text-center text-muted-foreground">
                  No video tutorials available at the moment.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center p-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <HelpCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Request Submitted</h2>
            <p className="text-gray-600">
              Your request has been submitted. Our support team will get back to you as soon as possible.
            </p>
            <Button 
              className="mt-6 bg-[#8A5BB7] hover:bg-[#8A5BB7]/90" 
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Help;
