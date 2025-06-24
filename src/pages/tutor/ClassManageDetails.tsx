
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClassDetails } from "@/hooks/use-class-details";
import { useClassSessions } from "@/hooks/use-class-sessions";
import SessionDialog from "@/components/tutor-dashboard/SessionDialog";
import MaterialDialog from "@/components/tutor-dashboard/MaterialDialog";
import ClassHeader from "@/components/tutor-dashboard/class-details/ClassHeader";
import StatsGrid from "@/components/tutor-dashboard/class-details/StatsGrid";
import CourseProgress from "@/components/tutor-dashboard/class-details/CourseProgress";
import NextSession from "@/components/tutor-dashboard/class-details/NextSession";
import SessionsTab from "@/components/tutor-dashboard/class-details/SessionsTab";
import StudentsTab from "@/components/tutor-dashboard/class-details/StudentsTab";
import MaterialsTab from "@/components/tutor-dashboard/class-details/MaterialsTab";

const ClassManageDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { classDetails, isLoading, error, refetch } = useClassDetails(id!);
  const { deleteSession } = useClassSessions();
  
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [selectedSessionFilter, setSelectedSessionFilter] = useState<string>('all');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading class details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading class: {error}</p>
          <Button onClick={refetch}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!classDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Class not found</p>
        </div>
      </div>
    );
  }

  const handleEditSession = (session: any) => {
    setSelectedSession(session);
    setSessionDialogOpen(true);
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      refetch();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const handleEditMaterial = (material: any) => {
    setSelectedMaterial(material);
    setMaterialDialogOpen(true);
  };

  const handleNewSession = () => {
    setSelectedSession(null);
    setSessionDialogOpen(true);
  };

  const handleNewMaterial = () => {
    setSelectedMaterial(null);
    setMaterialDialogOpen(true);
  };

  const enrolledCount = classDetails.enrolled_students?.length || 0;
  const completedSessions = classDetails.class_syllabus?.filter(s => s.week_number <= 5).length || 0;
  const totalSessions = classDetails.class_schedules?.[0]?.total_sessions || classDetails.class_syllabus?.length || 12;
  const completionRate = Math.round((completedSessions / totalSessions) * 100);

  return (
    <div className="space-y-6 p-6">
      {/* Class Header */}
      <ClassHeader classDetails={classDetails} />

      {/* Stats Grid */}
      <StatsGrid 
        classDetails={classDetails}
        enrolledCount={enrolledCount}
        completedSessions={completedSessions}
        totalSessions={totalSessions}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Section (3/4) */}
        <div className="lg:col-span-3">
          <CourseProgress 
            classDetails={classDetails}
            completionRate={completionRate}
          />
        </div>

        {/* Right Section (1/4) - Upcoming Session */}
        <div className="lg:col-span-1">
          <NextSession classDetails={classDetails} />
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="w-full bg-white border-b border-[#1F4E79]/10 rounded-none p-0 h-auto">
          <TabsTrigger 
            value="sessions"
            className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
          >
            Sessions
          </TabsTrigger>
          <TabsTrigger 
            value="students"
            className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
          >
            Students
          </TabsTrigger>
          <TabsTrigger 
            value="materials"
            className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
          >
            Materials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="pt-4">
          <SessionsTab
            classDetails={classDetails}
            onEditSession={handleEditSession}
            onDeleteSession={handleDeleteSession}
            onNewSession={handleNewSession}
          />
        </TabsContent>

        <TabsContent value="students" className="pt-4">
          <StudentsTab classDetails={classDetails} />
        </TabsContent>

        <TabsContent value="materials" className="pt-4">
          <MaterialsTab
            classDetails={classDetails}
            selectedSessionFilter={selectedSessionFilter}
            onSessionFilterChange={setSelectedSessionFilter}
            onEditMaterial={handleEditMaterial}
            onNewMaterial={handleNewMaterial}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <SessionDialog
        open={sessionDialogOpen}
        onOpenChange={setSessionDialogOpen}
        session={selectedSession}
        classId={id!}
        onSuccess={() => {
          refetch();
          setSessionDialogOpen(false);
        }}
      />

      <MaterialDialog
        open={materialDialogOpen}
        onOpenChange={setMaterialDialogOpen}
        material={selectedMaterial}
        classId={id!}
        sessions={classDetails.class_syllabus || []}
        onSuccess={() => {
          refetch();
          setMaterialDialogOpen(false);
        }}
      />
    </div>
  );
};

export default ClassManageDetails;
