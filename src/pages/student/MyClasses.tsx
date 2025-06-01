
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Filter,
  Star,
  MessageCircle,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface ClassCardProps {
  id: string;
  title: string;
  tutor: string;
  tutorId: string;
  type: string;
  format: string;
  payment: string;
  status: string;
  students: number;
  image: string;
  rating: number;
  description: string;
  classSize: string;
  onClick: () => void;
  onTutorClick: () => void;
  onMessageTutor: () => void;
}

const ClassCard = ({
  title,
  tutor,
  tutorId,
  type,
  format,
  payment,
  status,
  students,
  image,
  rating,
  description,
  classSize,
  onClick,
  onTutorClick,
  onMessageTutor,
}: ClassCardProps) => {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
      <div className="flex flex-col md:flex-row h-full">
        <div className="relative h-40 md:h-auto md:w-1/3 lg:w-1/4">
          <img src={image} alt={title} className="h-full w-full object-cover" />
        </div>
        <CardContent className="p-4 flex flex-col flex-1" onClick={onClick}>
          <div className="flex justify-between">
            <h3 className="font-medium text-lg">{title}</h3>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                status === "Completed" 
                  ? "bg-gray-100 text-gray-800" 
                  : status === "Enrolled" 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-green-100 text-green-800"
              }`}>
                {status}
              </span>
              <span className="px-2 py-1 rounded-full text-xs bg-[#E5D0FF] text-[#8A5BB7]">
                {payment}
              </span>
            </div>
          </div>
          
          <div className="flex items-center mt-1">
            <button 
              className="text-sm font-medium text-[#8A5BB7] hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onTutorClick();
              }}
            >
              {tutor}
            </button>
            <div className="flex items-center ml-4">
              <Star className="h-3 w-3 fill-yellow-400 stroke-yellow-400 mr-1" />
              <span className="text-xs font-medium">{rating.toFixed(1)}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{description}</p>
          
          <div className="flex justify-between mt-auto pt-4">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-gray-100">
                {type}
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-100">
                {format}
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-100">
                {classSize === "Group" ? `Students: ${students}` : "1-on-1"}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onMessageTutor();
                }}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>
              {status === "Completed" ? (
                <Button 
                  size="sm" 
                  className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReviewDialogOpen(true);
                  }}
                >
                  Submit Review
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
                >
                  {type === "Online" ? "Continue" : "View Class"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </div>
      
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Your Review</DialogTitle>
            <DialogDescription>
              Share your experience with this class to help other learners.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`h-8 w-8 cursor-pointer ${reviewRating >= star ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"}`}
                  onClick={() => setReviewRating(star)}
                />
              ))}
            </div>
            
            <Textarea 
              placeholder="Write your feedback about the class..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-32"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
              onClick={() => {
                // Submit review logic would go here
                setReviewDialogOpen(false);
                // Reset form
                setReviewText("");
                setReviewRating(5);
              }}
            >
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const MyClasses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Filter states
  const [classMode, setClassMode] = useState<"online" | "offline">("online");
  const [classFormat, setClassFormat] = useState<"live" | "recorded" | "inbound" | "outbound">("live");
  const [classSize, setClassSize] = useState<"group" | "1-on-1">("group");
  const [classDuration, setClassDuration] = useState<"finite" | "infinite">("finite");
  const [paymentModel, setPaymentModel] = useState<"one-time" | "subscription">("one-time");
  
  // Sample class data
  const classes = [
    {
      id: "class1",
      title: "Introduction to Calculus",
      tutor: "Dr. Smith",
      tutorId: "tutor1",
      type: "Online",
      format: "Live",
      payment: "Fixed",
      status: "Active",
      students: 15,
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=300",
      rating: 4.8,
      description: "Learn the foundations of calculus, including limits, derivatives, and integrals. This course provides a comprehensive introduction to mathematical concepts.",
      classSize: "Group",
    },
    {
      id: "class2",
      title: "Advanced Algorithms",
      tutor: "Prof. Johnson",
      tutorId: "tutor2",
      type: "Online",
      format: "Recorded",
      payment: "Subscription",
      status: "Enrolled",
      students: 42,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300",
      rating: 4.6,
      description: "Study complex algorithms and data structures. Learn about efficient problem-solving techniques for computational challenges.",
      classSize: "1-on-1",
    },
    {
      id: "class3",
      title: "Chemistry Lab",
      tutor: "Sarah Lee",
      tutorId: "tutor3",
      type: "Offline",
      format: "Inbound",
      payment: "Fixed",
      status: "Completed",
      students: 8,
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=300",
      rating: 4.9,
      description: "Hands-on laboratory experience covering various chemical reactions, lab safety, and experimental procedures.",
      classSize: "Group",
    },
  ];
    
  // Effect to handle format options based on class mode
  useEffect(() => {
    if (classMode === "online") {
      setClassFormat("live");
    } else {
      setClassFormat("inbound");
    }
  }, [classMode]);

  // Effect to handle class size options based on format
  useEffect(() => {
    if (classFormat === "outbound") {
      setClassSize("1-on-1");
    }
  }, [classFormat]);
  
  // Effect to handle payment model based on duration
  useEffect(() => {
    if (classDuration === "infinite") {
      setPaymentModel("subscription");
    }
  }, [classDuration]);
  
  const filteredClasses = classes.filter(cls => {
    // Filter by tab
    if (activeTab === "active") {
      return cls.status === "Active" || cls.status === "Enrolled";
    } else if (activeTab === "completed") {
      return cls.status === "Completed";
    } else {
      // For "all" tab
      return true;
    }
  }).filter(cls => {
    // Apply additional filters only if filter drawer has been opened
    if (!filterOpen) return true;
    
    // Apply mode filter
    if (classMode === "online" && cls.type !== "Online") return false;
    if (classMode === "offline" && cls.type !== "Offline") return false;
    
    // Apply format filter
    if (classMode === "online") {
      if (classFormat === "live" && cls.format !== "Live") return false;
      if (classFormat === "recorded" && cls.format !== "Recorded") return false;
    } else {
      if (classFormat === "inbound" && cls.format !== "Inbound") return false;
      if (classFormat === "outbound" && cls.format !== "Outbound") return false;
    }
    
    // Apply size filter
    if (classSize === "group" && cls.classSize !== "Group") return false;
    if (classSize === "1-on-1" && cls.classSize !== "1-on-1") return false;
    
    return true;
  });
  
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">My Classes</h1>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active Courses</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="p-4 space-y-6">
                  {/* Class Mode */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Class Mode</h3>
                    <RadioGroup 
                      value={classMode} 
                      onValueChange={(value) => setClassMode(value as "online" | "offline")}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="online" id="mode-online" />
                        <Label htmlFor="mode-online">Online</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="offline" id="mode-offline" />
                        <Label htmlFor="mode-offline">Offline</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  {/* Class Format */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Class Format</h3>
                    {classMode === "online" ? (
                      <RadioGroup 
                        value={classFormat} 
                        onValueChange={(value) => setClassFormat(value as "live" | "recorded")}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="live" id="format-live" />
                          <Label htmlFor="format-live">Live</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="recorded" id="format-recorded" />
                          <Label htmlFor="format-recorded">Recorded</Label>
                        </div>
                      </RadioGroup>
                    ) : (
                      <RadioGroup 
                        value={classFormat} 
                        onValueChange={(value) => setClassFormat(value as "inbound" | "outbound")}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="inbound" id="format-inbound" />
                          <Label htmlFor="format-inbound">Inbound</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="outbound" id="format-outbound" />
                          <Label htmlFor="format-outbound">Outbound</Label>
                        </div>
                      </RadioGroup>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Class Size */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Class Size</h3>
                    <RadioGroup 
                      value={classSize} 
                      onValueChange={(value) => setClassSize(value as "group" | "1-on-1")}
                      className="flex flex-col space-y-1"
                      disabled={classFormat === "outbound"}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="group" id="size-group" disabled={classFormat === "outbound"} />
                        <Label htmlFor="size-group" className={classFormat === "outbound" ? "text-gray-400" : ""}>Group</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1-on-1" id="size-1on1" />
                        <Label htmlFor="size-1on1">1-on-1</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  {/* Class Duration */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Class Duration</h3>
                    <RadioGroup 
                      value={classDuration} 
                      onValueChange={(value) => setClassDuration(value as "finite" | "infinite")}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="finite" id="duration-finite" />
                        <Label htmlFor="duration-finite">Finite classes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="infinite" id="duration-infinite" />
                        <Label htmlFor="duration-infinite">Infinite classes</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  {/* Payment Model */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Payment Model</h3>
                    <RadioGroup 
                      value={paymentModel} 
                      onValueChange={(value) => setPaymentModel(value as "one-time" | "subscription")}
                      className="flex flex-col space-y-1"
                      disabled={classDuration === "infinite"}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="one-time" id="payment-onetime" disabled={classDuration === "infinite"} />
                        <Label htmlFor="payment-onetime" className={classDuration === "infinite" ? "text-gray-400" : ""}>One-time payment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="subscription" id="payment-subscription" />
                        <Label htmlFor="payment-subscription">Subscription</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
                      onClick={() => setFilterOpen(false)}
                    >
                      Save Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => (
                  <ClassCard
                    key={cls.id}
                    {...cls}
                    onClick={() => navigate(`/classes/${cls.id}`)}
                    onTutorClick={() => navigate(`/tutor/${cls.tutorId}`)}
                    onMessageTutor={() => navigate(`/messages?tutor=${cls.tutorId}`)}
                  />
                ))
              ) : (
                <p className="text-center py-8 text-gray-500">No classes found</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyClasses;
