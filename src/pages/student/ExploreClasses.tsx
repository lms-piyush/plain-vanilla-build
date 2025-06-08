
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CourseCard from "@/components/dashboard/CourseCard";
import { useTutorClasses, TutorClass } from "@/hooks/use-tutor-classes";
import { useToast } from "@/hooks/use-toast";

const ExploreClasses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState(filterParam === "saved" ? "saved" : "all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Wishlist state - in a real app, this would come from the database
  const [wishlistedCourses, setWishlistedCourses] = useState<string[]>([]);
  
  // Filter states
  const [classMode, setClassMode] = useState<"online" | "offline">("online");
  const [classFormat, setClassFormat] = useState<"live" | "recorded" | "inbound" | "outbound">("live");
  const [classSize, setClassSize] = useState<"group" | "1-on-1">("group");
  const [classDuration, setClassDuration] = useState<"finite" | "infinite">("finite");
  const [paymentModel, setPaymentModel] = useState<"one-time" | "subscription">("one-time");
  
  const classesPerPage = 9;

  // Fetch classes with pagination for All Classes tab
  const { 
    classes: allClasses, 
    totalCount, 
    isLoading,
    refetch 
  } = useTutorClasses({
    page: activeTab === "all" ? currentPage : 1,
    pageSize: activeTab === "all" ? classesPerPage : 1000
  });

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

  // Reset to first page when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Handle wishlist toggle
  const toggleWishlist = (courseId: string) => {
    setWishlistedCourses((prev) => {
      const isCurrentlyWishlisted = prev.includes(courseId);
      const newWishlist = isCurrentlyWishlisted 
        ? prev.filter(id => id !== courseId) 
        : [...prev, courseId];
      
      toast({
        title: isCurrentlyWishlisted ? "Removed from saved classes" : "Added to saved classes",
        description: isCurrentlyWishlisted 
          ? "The class has been removed from your saved list." 
          : "The class has been added to your saved list.",
      });
      
      return newWishlist;
    });
  };

  // Convert TutorClass to CourseCard props
  const convertToClassCard = (tutorClass: TutorClass) => {
    const getClassMode = () => {
      return tutorClass.delivery_mode === 'online' ? 'Online' : 'Offline';
    };

    const getClassFormat = () => {
      switch (tutorClass.class_format) {
        case 'live': return 'Live';
        case 'recorded': return 'Recorded';
        case 'inbound': return 'Inbound';
        case 'outbound': return 'Outbound';
        default: return 'Live';
      }
    };

    const getClassSize = () => {
      return tutorClass.class_size === 'group' ? 'Group' : '1-on-1';
    };

    return {
      id: tutorClass.id,
      title: tutorClass.title,
      tutor: "Tutor Name", // This would come from tutor profile in real app
      tutorId: tutorClass.tutor_id,
      rating: 4.5, // This would come from reviews in real app
      image: tutorClass.thumbnail_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300",
      description: tutorClass.description || "",
      mode: getClassMode(),
      format: getClassFormat(),
      classSize: getClassSize(),
      students: tutorClass.max_students || 0,
      price: tutorClass.price ? `Rs. ${tutorClass.price}` : "Free",
      isSubscription: tutorClass.duration_type === 'recurring',
      wishListed: wishlistedCourses.includes(tutorClass.id)
    };
  };

  // Filter and sort classes for All Classes tab
  const getFilteredClasses = () => {
    let filtered = [...allClasses];
    
    // Apply filters if they've been set
    if (filterOpen) {
      // Apply mode filter
      filtered = filtered.filter(course => {
        if (classMode === "online") {
          return course.delivery_mode === "online";
        } else {
          return course.delivery_mode === "offline";
        }
      });
      
      // Apply format filter
      filtered = filtered.filter(course => {
        return course.class_format === classFormat;
      });
      
      // Apply class size filter
      filtered = filtered.filter(course => {
        if (classSize === "group") {
          return course.class_size === "group";
        } else {
          return course.class_size === "one-on-one";
        }
      });
      
      // Apply duration filter
      filtered = filtered.filter(course => {
        if (classDuration === "finite") {
          return course.duration_type === "fixed";
        } else {
          return course.duration_type === "recurring";
        }
      });
    }
    
    // Sort the classes
    switch (sortBy) {
      case "rating":
        return [...filtered].sort((a, b) => 4.5 - 4.5); // Would use real ratings
      case "newest":
        return [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case "popular":
      default:
        return filtered;
    }
  };

  // Get saved classes (classes in wishlist)
  const getSavedClasses = () => {
    return allClasses.filter(course => wishlistedCourses.includes(course.id));
  };

  const displayedClasses = activeTab === "saved" ? getSavedClasses() : getFilteredClasses();
  const totalPages = Math.ceil(totalCount / classesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pages;
  };
  
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Explore Classes</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <Tabs defaultValue={activeTab} className="mb-8 w-full" onValueChange={setActiveTab}>
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="all">All Classes</TabsTrigger>
                  <TabsTrigger value="saved">Saved Classes ({wishlistedCourses.length})</TabsTrigger>
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
                  
                  {activeTab === "all" && (
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
                  )}
                </div>
              </div>
              
              <TabsContent value={activeTab} className="mt-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
                        <div className="bg-gray-200 h-4 rounded mb-2"></div>
                        <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : displayedClasses.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {displayedClasses.map((course) => (
                        <CourseCard
                          key={course.id}
                          {...convertToClassCard(course)}
                          onClick={() => navigate(`/student/classes/${course.id}`)}
                          onTutorClick={() => navigate(`/student/tutor/${course.tutor_id}`)}
                          onWishlistToggle={() => toggleWishlist(course.id)}
                        />
                      ))}
                    </div>
                    
                    {/* Pagination for All Classes */}
                    {activeTab === "all" && totalPages > 1 && (
                      <div className="mt-8 flex justify-center">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                            
                            {renderPaginationNumbers()}
                            
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">
                      {activeTab === "saved" 
                        ? "No saved classes yet. Start exploring and save classes you're interested in!"
                        : "No courses found. Try adjusting your filters."
                      }
                    </p>
                    {activeTab === "saved" && (
                      <Button 
                        onClick={() => setActiveTab("all")}
                        className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
                      >
                        Explore Classes
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExploreClasses;
