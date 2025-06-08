
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/dashboard/CourseCard";
import { TutorClass } from "@/hooks/use-all-classes";

interface ClassesListProps {
  activeTab: string;
  isLoading: boolean;
  displayedClasses: TutorClass[];
  convertToClassCard: (tutorClass: TutorClass) => any;
  navigate: (path: string) => void;
  toggleWishlist: (courseId: string) => void;
  setActiveTab: (tab: string) => void;
}

const ClassesList = ({
  activeTab,
  isLoading,
  displayedClasses,
  convertToClassCard,
  navigate,
  toggleWishlist,
  setActiveTab
}: ClassesListProps) => {
  return (
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
  );
};

export default ClassesList;
