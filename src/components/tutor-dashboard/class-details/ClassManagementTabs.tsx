
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassDetails } from "@/types/class-details";
import SessionsTab from "./SessionsTab";
import StudentsTab from "./StudentsTab";
import MaterialsTab from "./MaterialsTab";
import ReviewsTab from "./ReviewsTab";

interface ClassManagementTabsProps {
  classDetails: ClassDetails;
  selectedSessionFilter: string;
  onSessionFilterChange: (filter: string) => void;
  onEditSession: (session: any) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewSession: () => void;
  onEditMaterial: (material: any) => void;
  onNewMaterial: () => void;
}

const ClassManagementTabs = ({
  classDetails,
  selectedSessionFilter,
  onSessionFilterChange,
  onEditSession,
  onDeleteSession,
  onNewSession,
  onEditMaterial,
  onNewMaterial,
}: ClassManagementTabsProps) => {
  const [activeTab, setActiveTab] = useState("sessions");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student);
    setActiveTab("students");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        <TabsTrigger value="students">Students</TabsTrigger>
        <TabsTrigger value="materials">Materials</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      
      <TabsContent value="sessions" className="space-y-4">
        <SessionsTab 
          classDetails={classDetails}
          onEditSession={onEditSession}
          onDeleteSession={onDeleteSession}
          onNewSession={onNewSession}
          onStudentSelect={handleStudentSelect}
        />
      </TabsContent>
      
      <TabsContent value="students" className="space-y-4">
        <StudentsTab 
          classDetails={classDetails}
          selectedStudent={selectedStudent}
          onStudentDeselect={() => setSelectedStudent(null)}
        />
      </TabsContent>
      
      <TabsContent value="materials" className="space-y-4">
        <MaterialsTab
          classDetails={classDetails}
          selectedSessionFilter={selectedSessionFilter}
          onSessionFilterChange={onSessionFilterChange}
          onEditMaterial={onEditMaterial}
          onNewMaterial={onNewMaterial}
        />
      </TabsContent>
      
      <TabsContent value="reviews" className="space-y-4">
        <ReviewsTab classId={classDetails.id} />
      </TabsContent>
    </Tabs>
  );
};

export default ClassManagementTabs;
