
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface CourseCardProps {
  id: string;
  title: string;
  tutor: string;
  tutorId: string;
  rating: number;
  image: string;
  description: string;
  mode: string;
  format: string;
  classSize: string;
  students: number;
  price: string;
  isSubscription: boolean;
  wishListed: boolean;
  onClick: () => void;
  onTutorClick: () => void;
  onWishlistToggle: () => void;
}

const CourseCard = ({
  id,
  title,
  tutor,
  tutorId,
  rating,
  image,
  description,
  mode,
  format,
  classSize,
  students,
  price,
  isSubscription,
  wishListed,
  onClick,
  onTutorClick,
  onWishlistToggle,
}: CourseCardProps) => {
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
    >
      <div className="relative h-40">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <button 
          className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            onWishlistToggle();
          }}
        >
          <Heart 
            className={`h-5 w-5 ${wishListed ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
          />
        </button>
      </div>
      <CardContent className="p-4 flex flex-col flex-grow" onClick={onClick}>
        <h3 className="font-medium text-base mb-1 line-clamp-1">{title}</h3>
        
        <div className="flex items-center mb-2">
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
        
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{description}</p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 text-xs mb-3">
            <span className="px-2 py-1 rounded-full bg-gray-100">
              {mode}
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100">
              {format}
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100">
              {classSize === "Group" ? `Students: ${students}` : "1-on-1"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#8A5BB7]">
              {price}
              {isSubscription && <span className="text-xs font-normal">/month</span>}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ExploreClasses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  
  const [activeTab, setActiveTab] = useState(filterParam === "saved" ? "saved" : "all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  
  // Wishlist state
  const [wishlistedCourses, setWishlistedCourses] = useState<string[]>(["course2", "course4"]);
  
  // Filter states
  const [classMode, setClassMode] = useState<"online" | "offline">("online");
  const [classFormat, setClassFormat] = useState<"live" | "recorded" | "inbound" | "outbound">("live");
  const [classSize, setClassSize] = useState<"group" | "1-on-1">("group");
  const [classDuration, setClassDuration] = useState<"finite" | "infinite">("finite");
  const [paymentModel, setPaymentModel] = useState<"one-time" | "subscription">("one-time");
  
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
  
  // Sample courses data
  const allCourses = [
    {
      id: "course1",
      title: "Introduction to Python",
      tutor: "Dr. Smith",
      tutorId: "tutor1",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300",
      description: "Learn the basics of Python programming language, from data types to advanced functions and object-oriented concepts.",
      mode: "Online",
      format: "Live",
      classSize: "Group",
      students: 25,
      price: "Rs. 1000",
      isSubscription: false
    },
    {
      id: "course2",
      title: "Advanced Mathematics",
      tutor: "Prof. Johnson",
      tutorId: "tutor2",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=300",
      description: "Dive deep into complex mathematical concepts including calculus, linear algebra, and differential equations.",
      mode: "Online",
      format: "Recorded",
      classSize: "Group",
      students: 35,
      price: "Rs. 1200",
      isSubscription: false
    },
    {
      id: "course3",
      title: "Web Development",
      tutor: "Sarah Lee",
      tutorId: "tutor3",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300",
      description: "Build responsive websites using HTML, CSS, and JavaScript. Learn modern frameworks like React and Node.js.",
      mode: "Online",
      format: "Live",
      classSize: "Group",
      students: 40,
      price: "Rs. 800",
      isSubscription: false
    },
    {
      id: "course4",
      title: "Data Science Fundamentals",
      tutor: "Michael Chang",
      tutorId: "tutor4",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=300",
      description: "Learn data analysis, visualization, and machine learning techniques using Python libraries like Pandas and scikit-learn.",
      mode: "Offline",
      format: "Inbound",
      classSize: "Group",
      students: 18,
      price: "Rs. 1500",
      isSubscription: false
    },
    {
      id: "course5",
      title: "Advanced UI/UX Design",
      tutor: "Emma Watson",
      tutorId: "tutor5",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300",
      description: "Master the principles of user interface and experience design. Create engaging digital products that users love.",
      mode: "Online",
      format: "Live",
      classSize: "1-on-1",
      students: 1,
      price: "Rs. 500",
      isSubscription: true
    },
    {
      id: "course6",
      title: "Advanced Machine Learning",
      tutor: "Chris Brown",
      tutorId: "tutor6",
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300",
      description: "Deep dive into neural networks, deep learning, and natural language processing. Build and deploy AI models.",
      mode: "Offline",
      format: "Outbound",
      classSize: "1-on-1",
      students: 1,
      price: "Rs. 2000",
      isSubscription: true
    },
  ];
  
  // Handle wishlist toggle
  const toggleWishlist = (courseId: string) => {
    setWishlistedCourses((prev) => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId) 
        : [...prev, courseId]
    );
  };
  
  // Filter and sort courses
  const filterCourses = () => {
    let filtered = activeTab === "saved" 
      ? allCourses.filter(course => wishlistedCourses.includes(course.id))
      : allCourses;
    
    // Apply filters if they've been set
    if (filterOpen) {
      // Apply mode filter
      if (classMode === "online") {
        filtered = filtered.filter(course => course.mode === "Online");
      } else {
        filtered = filtered.filter(course => course.mode === "Offline");
      }
      
      // Apply format filter
      if (classMode === "online") {
        if (classFormat === "live") {
          filtered = filtered.filter(course => course.format === "Live");
        } else if (classFormat === "recorded") {
          filtered = filtered.filter(course => course.format === "Recorded");
        }
      } else {
        if (classFormat === "inbound") {
          filtered = filtered.filter(course => course.format === "Inbound");
        } else if (classFormat === "outbound") {
          filtered = filtered.filter(course => course.format === "Outbound");
        }
      }
      
      // Apply class size filter
      if (classSize === "group") {
        filtered = filtered.filter(course => course.classSize === "Group");
      } else {
        filtered = filtered.filter(course => course.classSize === "1-on-1");
      }
      
      // Apply payment model filter
      if (paymentModel === "one-time") {
        filtered = filtered.filter(course => !course.isSubscription);
      } else {
        filtered = filtered.filter(course => course.isSubscription);
      }
    }
    
    // Sort the courses
    switch (sortBy) {
      case "rating":
        return [...filtered].sort((a, b) => b.rating - a.rating);
      case "newest":
        return [...filtered]; // In a real app, we'd sort by date
      case "popular":
      default:
        return filtered; // Assuming the default order is by popularity
    }
  };
  
  const displayedCourses = filterCourses();
  
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Explore Classes</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="w-full">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <Tabs defaultValue={activeTab} className="mb-8 w-full" onValueChange={setActiveTab}>
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="all">All Classes</TabsTrigger>
                  <TabsTrigger value="saved">Saved Classes</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center space-x-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rating</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
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
              </div>
              
              <TabsContent value={activeTab} className="mt-6">
                {displayedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        {...course}
                        wishListed={wishlistedCourses.includes(course.id)}
                        onClick={() => navigate(`/classes/${course.id}`)}
                        onTutorClick={() => navigate(`/tutor/${course.tutorId}`)}
                        onWishlistToggle={() => toggleWishlist(course.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-12 text-gray-500">
                    No courses found. Try adjusting your filters.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExploreClasses;
