
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { StudentClassDetails } from "@/hooks/use-student-class-details";
import LessonsTab from "./LessonsTab";
import ResourcesTab from "./ResourcesTab";
import ReviewsTab from "./ReviewsTab";

interface ClassTabsProps {
  classDetails: StudentClassDetails;
  classId: string;
}

const ClassTabs = ({ classDetails, classId }: ClassTabsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <Tabs defaultValue={classDetails.isEnrolled ? "lessons" : "reviews"} className="w-full">
        <div className="px-6 pt-4 border-b">
          <TabsList className="w-full justify-start">
            {classDetails.isEnrolled && (
              <>
                <TabsTrigger value="lessons" className="flex-1 sm:flex-none">Lessons</TabsTrigger>
                <TabsTrigger value="resources" className="flex-1 sm:flex-none">Resources</TabsTrigger>
              </>
            )}
            <TabsTrigger value="reviews" className="flex-1 sm:flex-none">Reviews</TabsTrigger>
          </TabsList>
        </div>
        
        {classDetails.isEnrolled && (
          <>
            <TabsContent value="lessons" className="p-6">
              <LessonsTab classDetails={classDetails} />
            </TabsContent>
            
            <TabsContent value="resources" className="p-6">
              <ResourcesTab classDetails={classDetails} />
            </TabsContent>
          </>
        )}
        
        <TabsContent value="reviews" className="p-6">
          <ReviewsTab classId={classId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassTabs;
