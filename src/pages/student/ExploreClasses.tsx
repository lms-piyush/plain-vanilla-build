
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAllClassesWithReviews } from "@/hooks/use-all-classes-with-reviews";
import { useWishlist } from "@/hooks/use-wishlist";
import CourseCard from "@/components/dashboard/CourseCard";
import ExploreClassesHeader from "@/components/explore/ExploreClassesHeader";
import FilterSheet from "@/components/explore/FilterSheet";
import ClassesList from "@/components/explore/ClassesList";

const ExploreClasses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Filter states
  const [deliveryMode, setDeliveryMode] = useState<"online" | "offline">("online");
  const [classFormat, setClassFormat] = useState<"live" | "recorded" | "inbound" | "outbound">("live");
  const [classSize, setClassSize] = useState<"group" | "1-on-1">("group");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const { data: classes = [], isLoading } = useAllClassesWithReviews();
  const { wishlistedCourses, toggleWishlist } = useWishlist();

  // Convert classes to course card format with real data
  const convertToClassCard = (tutorClass: any) => ({
    id: tutorClass.id,
    title: tutorClass.title,
    tutor: tutorClass.profiles?.full_name || "Unknown Tutor",
    tutorId: tutorClass.tutor_id,
    image: tutorClass.thumbnail_url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=450&q=80",
    category: tutorClass.subject || "General",
    rating: tutorClass.average_rating,
    totalReviews: tutorClass.total_reviews,
    price: tutorClass.price || 0,
    currency: tutorClass.currency || "USD",
    studentsCount: tutorClass.student_count,
    type: tutorClass.delivery_mode === "online" ? "Online" : "Offline",
    format: tutorClass.class_format === "live" ? "Live" : 
            tutorClass.class_format === "recorded" ? "Recorded" :
            tutorClass.class_format === "inbound" ? "Inbound" : "Outbound",
    classSize: tutorClass.class_size === "group" ? "Group" : "1-on-1",
    isWishlisted: wishlistedCourses.includes(tutorClass.id),
    description: tutorClass.description || "No description available"
  });

  // Filter classes based on current filters  
  const filteredClasses = classes.filter((cls) => {
    // Search filter
    if (searchQuery && !cls.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !cls.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !cls.subject?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Delivery mode filter
    if (cls.delivery_mode !== deliveryMode) return false;

    // Format filter
    if (cls.class_format !== classFormat) return false;

    // Size filter - handle type conversion
    const expectedSize = classSize === "1-on-1" ? "one-on-one" : "group";
    if (deliveryMode === "offline" && classFormat === "inbound") {
      // Inbound is always one-on-one, so skip size filter
    } else if (cls.class_size !== expectedSize) {
      return false;
    }

    // Price filter
    const price = cls.price || 0;
    if (price < priceRange[0] || price > priceRange[1]) return false;

    // Subject filter
    if (selectedSubjects.length > 0 && !selectedSubjects.includes(cls.subject || "")) {
      return false;
    }

    return true;
  });

  const displayedClasses = activeTab === "saved" 
    ? filteredClasses.filter(cls => wishlistedCourses.includes(cls.id))
    : filteredClasses;

  return (
    <div className="space-y-6">
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
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          deliveryMode={deliveryMode}
          setDeliveryMode={setDeliveryMode}
          classFormat={classFormat}
          setClassFormat={setClassFormat}
          classSize={classSize}
          setClassSize={setClassSize}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedSubjects={selectedSubjects}
          setSelectedSubjects={setSelectedSubjects}
        />
      </ExploreClassesHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All Classes ({filteredClasses.length})
          </TabsTrigger>
          <TabsTrigger value="saved">
            Saved ({filteredClasses.filter(cls => wishlistedCourses.includes(cls.id)).length})
          </TabsTrigger>
        </TabsList>

        <ClassesList
          activeTab={activeTab}
          isLoading={isLoading}
          displayedClasses={displayedClasses}
          convertToClassCard={convertToClassCard}
          navigate={navigate}
          toggleWishlist={toggleWishlist}
          setActiveTab={setActiveTab}
        />
      </Tabs>
    </div>
  );
};

export default ExploreClasses;
