
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs } from "@/components/ui/tabs";
import ExploreClassesHeader from "@/components/explore/ExploreClassesHeader";
import FilterSheet from "@/components/student/FilterSheet";
import ClassesList from "@/components/explore/ClassesList";
import ClassesPagination from "@/components/explore/ClassesPagination";
import SearchInput from "@/components/student/SearchInput";
import SearchResults from "@/components/student/SearchResults";
import { useFilteredClasses } from "@/hooks/use-filtered-classes";
import { useSavedClasses } from "@/hooks/use-saved-classes";
import { useFilterEffects } from "@/hooks/use-filter-effects";
import { useSearchResults } from "@/hooks/use-search-results";
import { convertToClassCard } from "@/utils/class-converter";
import { getSavedClasses } from "@/utils/class-filters";
import ActiveFilterDisplay from "@/components/common/ActiveFilterDisplay";
import { useFilterState } from "@/hooks/use-filter-state";

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
  
  // Saved classes management
  const { savedClassIds, toggleSaveClass, isClassSaved } = useSavedClasses();
  
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

  // Use filtered classes hook with server-side filtering and sorting
  const filterValues = getFilterValues();
  const { 
    data: queryResult, 
    isLoading,
    error,
    refetch 
  } = useFilteredClasses({
    page: currentPage,
    pageSize: classesPerPage,
    ...filterValues,
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
    const savedClasses = getSavedClasses(allClasses, savedClassIds);
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

  const handleApplyFilters = () => {
    console.log("ExploreClasses - Applying filters:", {
      classMode,
      classFormat,
      classSize,
      classDuration,
      paymentModel
    });
    setFiltersApplied(true);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  console.log("ExploreClasses - Current filter state:", {
    classMode,
    classFormat,
    classSize,
    classDuration,
    paymentModel,
    filtersApplied
  });

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

      {/* Active Filters Display */}
      <div className="mb-6">
        <ActiveFilterDisplay
          filters={activeFilters}
          onRemoveFilter={removeFilter}
          onClearAll={clearAllFilters}
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full">
          <ExploreClassesHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            sortBy={sortBy}
            setSortBy={setSortBy}
            wishlistedCourses={savedClassIds}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
          >
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
          </ExploreClassesHeader>
          
          <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
            <ClassesList
              activeTab={activeTab}
              isLoading={isLoading}
              displayedClasses={displayedClasses}
              convertToClassCard={(tutorClass) => convertToClassCard(tutorClass, savedClassIds)}
              navigate={navigate}
              toggleWishlist={toggleSaveClass}
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
