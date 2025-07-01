
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useStudentEnrollmentsWithReviews } from "@/hooks/use-student-enrollments-with-reviews";
import { useFilterEffects } from "@/hooks/use-filter-effects";
import ClassCard from "@/components/student/ClassCard";
import FilterSheet from "@/components/student/FilterSheet";

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
  
  // Fetch enrolled classes with review data
  const { data: enrollments = [], isLoading, error, refetch } = useStudentEnrollmentsWithReviews();

  // Filter effects
  useFilterEffects({
    classMode,
    classFormat,
    classDuration,
    setClassFormat,
    setClassSize,
    setPaymentModel
  });

  // Force refetch when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  // Convert enrollments to class cards with real data
  const classes = enrollments.map(enrollment => ({
    id: enrollment.classes.id,
    title: enrollment.classes.title,
    tutor: enrollment.classes.profiles?.full_name || "Unknown Tutor",
    tutorId: enrollment.classes.tutor_id,
    type: enrollment.classes.delivery_mode === "online" ? "Online" : "Offline",
    format: enrollment.classes.class_format === "live" ? "Live" : 
            enrollment.classes.class_format === "recorded" ? "Recorded" :
            enrollment.classes.class_format === "inbound" ? "Inbound" : "Outbound",
    payment: enrollment.classes.currency === "USD" ? "One-time" : "Subscription",
    status: enrollment.status === "active" ? "Active" : "Completed",
    students: enrollment.classes.student_count,
    image: enrollment.classes.thumbnail_url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=450&q=80",
    rating: enrollment.classes.average_rating,
    description: enrollment.classes.description || "No description available",
    classSize: enrollment.classes.class_size === "group" ? "Group" : "1-on-1"
  }));
  
  console.log("My Classes - Total enrollments:", enrollments.length);
  console.log("My Classes - Converted classes:", classes.length);
  
  const filteredClasses = classes.filter(cls => {
    // Filter by tab first
    if (activeTab === "active") {
      return cls.status === "Active" || cls.status === "Enrolled";
    } else if (activeTab === "completed") {
      return cls.status === "Completed";
    }
    // For "all" tab, include all classes
    return true;
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
    
    // Apply duration filter
    if (classDuration === "finite" && cls.payment === "Subscription") return false;
    if (classDuration === "infinite" && cls.payment !== "Subscription") return false;
    
    return true;
  });

  console.log("My Classes - Filtered classes:", filteredClasses.length);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-6">My Classes</h1>
        <p>Loading your enrolled classes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-6">My Classes</h1>
        <p className="text-red-500 mb-4">Error loading classes: {error.message}</p>
        <Button 
          onClick={() => refetch()}
          className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">My Classes</h1>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All ({classes.length})</TabsTrigger>
              <TabsTrigger value="active">
                Active Courses ({classes.filter(c => c.status === "Active" || c.status === "Enrolled").length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({classes.filter(c => c.status === "Completed").length})
              </TabsTrigger>
            </TabsList>
            
            <FilterSheet
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              classMode={classMode}
              setClassMode={setClassMode}
              classFormat={classFormat}
              setClassFormat={setClassFormat}
              classSize={classSize}
              setClassSize={setClassSize}
              classDuration={classDuration}
              setClassDuration={setClassDuration}
              paymentModel={paymentModel}
              setPaymentModel={setPaymentModel}
            />
          </div>
          
          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => (
                  <ClassCard
                    key={cls.id}
                    {...cls}
                    onClick={() => navigate(`/student/classes/${cls.id}`)}
                    onTutorClick={() => navigate(`/student/tutor/${cls.tutorId}`)}
                    onMessageTutor={() => {}} // This is now handled inside ClassCard
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    {enrollments.length === 0 
                      ? "You haven't enrolled in any classes yet." 
                      : "No classes found matching your filters."
                    }
                  </p>
                  {enrollments.length === 0 && (
                    <Button 
                      onClick={() => navigate('/student/explore')}
                      className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
                    >
                      Explore Classes
                    </Button>
                  )}
                  {enrollments.length > 0 && filteredClasses.length === 0 && (
                    <Button 
                      onClick={() => setFilterOpen(false)}
                      variant="outline"
                      className="mr-2"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default MyClasses;
