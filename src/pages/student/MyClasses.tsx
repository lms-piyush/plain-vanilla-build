
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import SearchInput from "@/components/student/SearchInput";
import SearchResults from "@/components/student/SearchResults";
import { useStudentEnrollmentsWithReviews } from "@/hooks/use-student-enrollments-with-reviews";
import { useFilterEffects } from "@/hooks/use-filter-effects";
import { useSearchResults } from "@/hooks/use-search-results";
import { useFilteredClasses } from "@/hooks/use-filtered-classes";
import { convertEnrollmentToClassCard } from "@/utils/enrollment-converter";
import ClassCard from "@/components/student/ClassCard";
import FilterSheet from "@/components/student/FilterSheet";
import ActiveFilterDisplay from "@/components/common/ActiveFilterDisplay";
import { useFilterState } from "@/hooks/use-filter-state";
import UpcomingSessionsCard from "@/components/student/UpcomingSessionsCard";
import { useUpcomingSessions } from "@/hooks/use-upcoming-sessions";

const MyClasses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Use enhanced filter state management
  const {
    classMode,
    classFormat, 
    classSize,
    classDuration,
    paymentModel,
    setClassMode,
    setClassFormat,
    setClassSize,
    setClassDuration,
    setPaymentModel,
    filtersApplied,
    setFiltersApplied,
    activeFilters,
    removeFilter,
    clearAllFilters,
    getFilterValues
  } = useFilterState();
  
  // Search functionality
  const { results: searchResults, isLoading: searchLoading, error: searchError, searchClassesAndTutors } = useSearchResults();
  
  // Fetch enrolled classes with review data from database
  const { data: enrollments = [], isLoading: enrollmentsLoading, error: enrollmentsError, refetch } = useStudentEnrollmentsWithReviews();

  // Get enrolled class IDs for filtering
  const enrolledClassIds = enrollments?.map(enrollment => enrollment.class_id) || [];
  
  // Use filtered classes hook with server-side filtering
  const filterValues = getFilterValues();
  const { data: filteredData, isLoading: isFilteredLoading, error: filteredError } = useFilteredClasses({
    enrolledOnly: true,
    enrolledClasses: enrolledClassIds,
    ...filterValues
  });

  // Fetch upcoming sessions
  const { sessions: upcomingSessions, isLoading: isSessionsLoading } = useUpcomingSessions();

  const isLoading = enrollmentsLoading || isFilteredLoading;
  const error = enrollmentsError || filteredError;

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
  
  // Use filtered data when available, fallback to enrollments data
  const classes = (filteredData?.classes || enrollments)?.map(enrollment => {
    // Check if this is from filtered classes (has class_reviews) or enrollments (has class)
    if ('class' in enrollment) {
      // This is from enrollments - use the converter
      return convertEnrollmentToClassCard(enrollment);
    } else {
      // This is from filtered classes - convert directly
      return {
        id: enrollment.id,
        className: enrollment.title,
        title: enrollment.title,
        tutor: enrollment.tutor_name,
        tutorId: enrollment.tutor_id,
        image: enrollment.thumbnail_url || "",
        rating: enrollment.average_rating || 0,
        reviewCount: enrollment.total_reviews || 0,
        price: enrollment.price || 0,
        duration: 60,
        nextDate: "2024-01-15",
        tags: [],
        lectureType: enrollment.delivery_mode === "online" ? "online" : "offline" as const,
        classId: enrollment.id,
        status: "Active", // Default status for filtered classes
        type: enrollment.delivery_mode === "online" ? "Online" : "Offline",
        format: enrollment.class_format === "live" ? "Live" : 
                enrollment.class_format === "recorded" ? "Recorded" :
                enrollment.class_format === "inbound" ? "Inbound" : "Outbound",
        classSize: enrollment.class_size === "group" ? "Group" : "1-on-1",
        payment: "One-time", // Default payment
        batchNumber: 1,
        isCurrentBatch: true,
        students: enrollment.student_count || 0,
        description: enrollment.description || ""
      };
    }
  }) || [];
  
  console.log("My Classes - Total enrollments:", enrollments.length);
  console.log("My Classes - Converted classes:", classes.length);
  console.log("My Classes - Sample enrollment data:", enrollments[0]);
  console.log("My Classes - Sample converted class:", classes[0]);
  
  // Apply tab filtering (active/completed)
  const filteredClasses = classes.filter(cls => {
    if (activeTab === "active") {
      return cls.status === "Active" || cls.status === "Enrolled";
    } else if (activeTab === "completed") {
      return cls.status === "Completed";
    }
    return true;
  });

  console.log("My Classes - Filtered classes:", filteredClasses.length);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchClassesAndTutors(query);
  };

  const handleApplyFilters = () => {
    setFiltersApplied(true);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-6">My Classes</h1>
        <p>Loading your enrolled classes...</p>
      </div>
    );
  }

  if (error) {
    console.error("Error in MyClasses component:", error);
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

      {/* Upcoming Sessions */}
      <div className="mb-6">
        <UpcomingSessionsCard sessions={upcomingSessions} isLoading={isSessionsLoading} />
      </div>
      
      {/* Search Section */}
      <div className="mb-6">
        <SearchInput
          onSearch={handleSearch}
          placeholder="Search your classes and tutors..."
          className="max-w-md"
        />
        <SearchResults
          results={searchResults}
          isLoading={searchLoading}
          error={searchError}
          query={searchQuery}
        />
      </div>

      {/* Active Filters Display */}
      <div className="mb-6">
        <ActiveFilterDisplay
          filters={activeFilters}
          onRemoveFilter={removeFilter}
          onClearAll={clearAllFilters}
        />
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">
                Active
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed
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
              onApplyFilters={handleApplyFilters}
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
                    onMessageTutor={() => {}}
                    batchNumber={cls.batchNumber}
                    isCurrentBatch={cls.isCurrentBatch}
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
                      onClick={clearAllFilters}
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
