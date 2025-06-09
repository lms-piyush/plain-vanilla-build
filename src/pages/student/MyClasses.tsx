
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useStudentEnrollments } from "@/hooks/use-student-enrollments";
import { useFilterEffects } from "@/hooks/use-filter-effects";
import { convertEnrollmentToClassCard } from "@/utils/enrollment-converter";
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
  
  // Fetch enrolled classes from database
  const { data: enrollments = [], isLoading, error } = useStudentEnrollments();

  // Filter effects
  useFilterEffects({
    classMode,
    classFormat,
    classDuration,
    setClassFormat,
    setClassSize,
    setPaymentModel
  });
  
  // Convert enrollments to class cards
  const classes = enrollments.map(convertEnrollmentToClassCard);
  
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
        <p className="text-red-500">Error loading classes. Please try again.</p>
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
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active Courses</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
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
                    onClick={() => navigate(`/classes/${cls.id}`)}
                    onTutorClick={() => navigate(`/tutor/${cls.tutorId}`)}
                    onMessageTutor={() => navigate(`/messages?tutor=${cls.tutorId}`)}
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
                      onClick={() => navigate('/explore')}
                      className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
                    >
                      Explore Classes
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
