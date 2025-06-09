
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs } from "@/components/ui/tabs";
import ExploreClassesHeader from "@/components/explore/ExploreClassesHeader";
import FilterSheet from "@/components/explore/FilterSheet";
import ClassesList from "@/components/explore/ClassesList";
import ClassesPagination from "@/components/explore/ClassesPagination";
import { useAllClasses, TutorClass } from "@/hooks/use-all-classes";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ExploreClasses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState(filterParam === "saved" ? "saved" : "all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [tutorNames, setTutorNames] = useState<{[key: string]: string}>({});
  const [tutorNamesLoading, setTutorNamesLoading] = useState(false);
  
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
    error,
    refetch 
  } = useAllClasses({
    page: activeTab === "all" ? currentPage : 1,
    pageSize: activeTab === "all" ? classesPerPage : 1000
  });

  // Fetch tutor names when classes are loaded
  useEffect(() => {
    const fetchTutorNames = async () => {
      if (allClasses.length > 0) {
        setTutorNamesLoading(true);
        const tutorIds = [...new Set(allClasses.map(cls => cls.tutor_id))];
        
        console.log("Fetching tutor names for IDs:", tutorIds);
        
        try {
          const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', tutorIds);

          console.log("Profiles response:", profiles, "Error:", error);

          if (profiles && !error) {
            const nameMap = profiles.reduce((acc, profile) => {
              acc[profile.id] = profile.full_name || 'Unknown Tutor';
              return acc;
            }, {} as {[key: string]: string});
            
            console.log("Created name map:", nameMap);
            setTutorNames(nameMap);
          } else {
            console.error('Error fetching tutor profiles:', error);
            // Set fallback names for all tutors
            const fallbackNames = tutorIds.reduce((acc, id) => {
              acc[id] = 'Unknown Tutor';
              return acc;
            }, {} as {[key: string]: string});
            setTutorNames(fallbackNames);
          }
        } catch (err) {
          console.error('Error fetching tutor names:', err);
          // Set fallback names for all tutors
          const fallbackNames = tutorIds.reduce((acc, id) => {
            acc[id] = 'Unknown Tutor';
            return acc;
          }, {} as {[key: string]: string});
          setTutorNames(fallbackNames);
        } finally {
          setTutorNamesLoading(false);
        }
      }
    };

    fetchTutorNames();
  }, [allClasses]);

  // Debug logging
  useEffect(() => {
    console.log("ExploreClasses - Component state:", {
      activeTab,
      allClasses,
      totalCount,
      isLoading,
      error,
      classesLength: allClasses.length,
      tutorNames,
      tutorNamesLoading
    });
  }, [activeTab, allClasses, totalCount, isLoading, error, tutorNames, tutorNamesLoading]);

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

    // Get tutor name - ensure we have the tutor name from profiles
    const getTutorName = () => {
      if (tutorNamesLoading) {
        return "Loading tutor...";
      }
      
      const tutorName = tutorNames[tutorClass.tutor_id];
      console.log(`Getting tutor name for ${tutorClass.tutor_id}:`, tutorName);
      
      return tutorName || "Unknown Tutor";
    };

    return {
      id: tutorClass.id,
      title: tutorClass.title,
      tutor: getTutorName(),
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
    
    console.log("Filtering classes:", filtered.length, "total classes");
    
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

  console.log("Final displayed classes:", displayedClasses.length);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Show error state if there's an error
  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-6">Explore Classes</h1>
        <div className="text-red-500 mb-4">
          Error loading classes: {error}
        </div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-[#8A5BB7] text-white rounded hover:bg-[#8A5BB7]/90"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Explore Classes</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full">
          <ExploreClassesHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            sortBy={sortBy}
            setSortBy={setSortBy}
            wishlistedCourses={wishlistedCourses}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
          >
            <FilterSheet
              classMode={classMode}
              setClassMode={setClassMode}
              classFormat={classFormat}
              setClassFormat={setClassFormat}
              classSize={classSize}
              setClassSize={setClassSize}
              classDuration={classDuration}
              setClassDuration={setClassDuration}
              setFilterOpen={setFilterOpen}
            />
          </ExploreClassesHeader>
          
          <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
            <ClassesList
              activeTab={activeTab}
              isLoading={isLoading}
              displayedClasses={displayedClasses}
              convertToClassCard={convertToClassCard}
              navigate={navigate}
              toggleWishlist={toggleWishlist}
              setActiveTab={setActiveTab}
            />
            
            <ClassesPagination
              activeTab={activeTab}
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ExploreClasses;
