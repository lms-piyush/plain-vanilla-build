
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
import { HelpCircle } from "lucide-react";

const Help = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIssues, setUserIssues] = useState([
    {
      id: 1,
      title: "Login Issue",
      description: "Unable to login with correct password",
      status: "In Progress"
    },
    {
      id: 2,
      title: "Payment Failed",
      description: "Payment was declined but funds were deducted",
      status: "Resolved"
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (subject && message) {
      // Add the new issue to the list
      setUserIssues([
        ...userIssues,
        {
          id: userIssues.length + 1,
          title: subject,
          description: message,
          status: "In Progress"
        }
      ]);
      
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
    {
      id: "general",
      name: "General",
      faqs: [
        {
          question: "How do I enroll in a class?",
          answer: "To enroll in a class, navigate to the Explore Classes page and select the class you're interested in. Click the Enroll button and follow the payment instructions to complete your enrollment."
        },
        {
          question: "What payment methods are accepted?",
          answer: "We accept credit/debit cards, UPI, and netbanking. You can manage your payment methods in your Profile page under the Payment Method section."
        }
      ]
    },
    {
      id: "classes",
      name: "Classes",
      faqs: [
        {
          question: "How do I join an online class?",
          answer: "You can join an online class from your Dashboard or My Classes page. Click on the 'Start Session' button when it becomes available (usually 1 minute before the scheduled time)."
        },
        {
          question: "What's the difference between inbound and outbound offline classes?",
          answer: "Inbound classes take place at the tutor's location, and you'll need to travel there. Outbound classes take place at your location, and the tutor will travel to you."
        }
      ]
    },
    {
      id: "billing",
      name: "Billing",
      faqs: [
        {
          question: "Can I get a refund if I'm not satisfied with a class?",
          answer: "Yes, we offer a 7-day satisfaction guarantee. If you're not satisfied with a class, you can request a refund within 7 days of enrollment."
        },
        {
          question: "How do I update my billing information?",
          answer: "You can update your billing information in your Profile page under the Payment Method section."
        }
      ]
    }
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
              >
                Submit Request
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
                  {userIssues.map((issue) => (
                    <tr key={issue.id} className="border-b">
                      <td className="py-3 px-4">{issue.title}</td>
                      <td className="py-3 px-4">{issue.description}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          issue.status === "Resolved" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {issue.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {userIssues.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-gray-500">
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
          <Tabs defaultValue="general">
            <TabsList className="mb-6">
              {faqCategories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {faqCategories.map(category => (
              <TabsContent key={category.id} value={category.id}>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.id}-item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-lg border p-3">
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-2">
                  <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium">How to {item === 1 ? 'Join Classes' : item === 2 ? 'Track Progress' : 'Contact Tutors'}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Learn how to {item === 1 ? 'join and participate in your enrolled classes' : item === 2 ? 'track your learning progress effectively' : 'get in touch with your class tutors'}
                </p>
              </div>
            ))}
          </div>
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
