
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs } from "@/components/ui/tabs";
import ExploreClassesHeader from "@/components/explore/ExploreClassesHeader";
import FilterSheet from "@/components/explore/FilterSheet";
import ClassesList from "@/components/explore/ClassesList";
import ClassesPagination from "@/components/explore/ClassesPagination";
import SearchInput from "@/components/student/SearchInput";
import SearchResults from "@/components/student/SearchResults";
import { useFilteredClasses } from "@/hooks/use-filtered-classes";
import { useWishlist } from "@/hooks/use-wishlist";
import { useFilterEffects } from "@/hooks/use-filter-effects";
import { useSearchResults } from "@/hooks/use-search-results";
import { convertToClassCard } from "@/utils/class-converter";
import { getSavedClasses } from "@/utils/class-filters";

const ExploreClasses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  
  const [activeTab, setActiveTab] = useState(filterParam === "saved" ? "saved" : "all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Search functionality
  const { results: searchResults, isLoading: searchLoading, error: searchError, searchClassesAndTutors } = useSearchResults();
  
  // Wishlist management
  const { wishlistedCourses, toggleWishlist } = useWishlist();
  
  // Filter states
  const [classMode, setClassMode] = useState<"online" | "offline">("online");
  const [classFormat, setClassFormat] = useState<"live" | "recorded" | "inbound" | "outbound">("live");
  const [classSize, setClassSize] = useState<"group" | "1-on-1">("group");
  const [classDuration, setClassDuration] = useState<"finite" | "infinite">("finite");
  
  const classesPerPage = 9;

  // Filter effects
  useFilterEffects({
    classMode,
    classFormat,
    classDuration,
    setClassFormat,
    setClassSize,
    setPaymentModel: () => {} // Not used in explore classes
  });

  // Use filtered classes hook with server-side filtering and sorting
  const { 
    data: queryResult, 
    isLoading,
    error,
    refetch 
  } = useFilteredClasses({
    page: currentPage,
    pageSize: classesPerPage,
    classMode: filterOpen ? classMode : undefined,
    classFormat: filterOpen ? classFormat : undefined,
    classSize: filterOpen ? classSize : undefined,
    classDuration: filterOpen ? (classDuration === "finite" ? "fixed" : "recurring") : undefined,
    sortBy: sortBy as "popular" | "rating" | "newest"
  });

  // Extract classes and totalCount from the query result
  const allClasses = queryResult?.classes || [];
  const totalCount = queryResult?.totalCount || 0;

  // Debug logging
  useEffect(() => {
    console.log("ExploreClasses - Component state:", {
      activeTab,
      allClasses: allClasses.length,
      isLoading,
      error,
      filterOpen
    });
  }, [activeTab, allClasses, isLoading, error, filterOpen]);

  // Reset to first page when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Force refetch when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Apply filtering based on active tab
  let displayedClasses = [];
  let totalPages = 1;
  
  if (activeTab === "saved") {
    const savedClasses = getSavedClasses(allClasses, wishlistedCourses);
    const startIndex = (currentPage - 1) * classesPerPage;
    const endIndex = startIndex + classesPerPage;
    displayedClasses = savedClasses.slice(startIndex, endIndex);
    totalPages = Math.ceil(savedClasses.length / classesPerPage);
  } else {
    // For "all" tab, use server-side filtered and paginated results
    displayedClasses = allClasses;
    totalPages = Math.ceil(totalCount / classesPerPage);
  }

  console.log("All classes:", allClasses.length);
  console.log("Displayed classes:", displayedClasses.length);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchClassesAndTutors(query);
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
      
      {/* Search Section */}
      <div className="mb-6">
        <SearchInput
          onSearch={handleSearch}
          placeholder="Search classes and tutors..."
          className="max-w-md"
        />
        <SearchResults
          results={searchResults}
          isLoading={searchLoading}
          error={searchError}
          query={searchQuery}
        />
      </div>
      
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
            
            {totalPages > 1 && (
              <ClassesPagination
                activeTab={activeTab}
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
              />
            )}
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ExploreClasses;
