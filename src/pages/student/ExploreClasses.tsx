
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs } from "@/components/ui/tabs";
import ExploreClassesHeader from "@/components/explore/ExploreClassesHeader";
import FilterSheet from "@/components/explore/FilterSheet";
import ClassesList from "@/components/explore/ClassesList";
import ClassesPagination from "@/components/explore/ClassesPagination";
import { useAllClasses } from "@/hooks/use-all-classes";
import { useWishlist } from "@/hooks/use-wishlist";
import { useFilterEffects } from "@/hooks/use-filter-effects";
import { convertToClassCard } from "@/utils/class-converter";
import { getFilteredClasses, getSavedClasses } from "@/utils/class-filters";

const ExploreClasses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  
  const [activeTab, setActiveTab] = useState(filterParam === "saved" ? "saved" : "all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Wishlist management
  const { wishlistedCourses, toggleWishlist } = useWishlist();
  
  // Filter states
  const [classMode, setClassMode] = useState<"online" | "offline">("online");
  const [classFormat, setClassFormat] = useState<"live" | "recorded" | "inbound" | "outbound">("live");
  const [classSize, setClassSize] = useState<"group" | "1-on-1">("group");
  const [classDuration, setClassDuration] = useState<"finite" | "infinite">("finite");
  const [paymentModel, setPaymentModel] = useState<"one-time" | "subscription">("one-time");
  
  const classesPerPage = 9;

  // Filter effects
  useFilterEffects({
    classMode,
    classFormat,
    classDuration,
    setClassFormat,
    setClassSize,
    setPaymentModel
  });

  // Fetch classes with tutors using proper joins
  const { 
    data: queryResult, 
    isLoading,
    error,
    refetch 
  } = useAllClasses({
    page: activeTab === "all" ? currentPage : 1,
    pageSize: activeTab === "all" ? classesPerPage : 1000
  });

  // Extract classes and totalCount from the query result
  const allClasses = queryResult?.classes || [];
  const totalCount = queryResult?.totalCount || 0;

  // Debug logging
  useEffect(() => {
    console.log("ExploreClasses - Component state:", {
      activeTab,
      allClasses,
      totalCount,
      isLoading,
      error,
      classesLength: allClasses.length
    });
  }, [activeTab, allClasses, totalCount, isLoading, error]);

  // Reset to first page when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const displayedClasses = activeTab === "saved" 
    ? getSavedClasses(allClasses, wishlistedCourses) 
    : getFilteredClasses(allClasses, {
        classMode,
        classFormat,
        classSize,
        classDuration,
        sortBy,
        filterOpen
      });

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
          Error loading classes: {error.message}
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
              convertToClassCard={(tutorClass) => convertToClassCard(tutorClass, wishlistedCourses)}
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
