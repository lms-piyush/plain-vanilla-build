
import { useParams } from "react-router-dom";
import { useClassDetails } from "@/hooks/use-class-details";
import { useClassManagement } from "@/hooks/use-class-management";
import LoadingState from "@/components/tutor-dashboard/class-details/LoadingState";
import ErrorState from "@/components/tutor-dashboard/class-details/ErrorState";
import NotFoundState from "@/components/tutor-dashboard/class-details/NotFoundState";
import ClassManagementHeader from "@/components/tutor-dashboard/class-details/ClassManagementHeader";
import ClassProgressSection from "@/components/tutor-dashboard/class-details/ClassProgressSection";
import ClassManagementTabs from "@/components/tutor-dashboard/class-details/ClassManagementTabs";
import ClassDialogs from "@/components/tutor-dashboard/class-details/ClassDialogs";

const ClassManageDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { classDetails, isLoading, error, refetch } = useClassDetails(id!);
  
  const {
    sessionDialogOpen,
    setSessionDialogOpen,
    materialDialogOpen,
    setMaterialDialogOpen,
    selectedSession,
    selectedMaterial,
    selectedSessionFilter,
    setSelectedSessionFilter,
    isNewSession,
    handleEditSession,
    handleDeleteSession,
    handleEditMaterial,
    handleNewSession,
    handleNewMaterial,
    getNextSessionNumber,
    calculateStats,
  } = useClassManagement(refetch);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!classDetails) {
    return <NotFoundState />;
  }

  const { enrolledCount, totalSessions, completedSessions, completionRate } = calculateStats(classDetails);

  return (
    <div className="space-y-6 p-6">
      <ClassManagementHeader
        classDetails={classDetails}
        enrolledCount={enrolledCount}
        completedSessions={completedSessions}
        totalSessions={totalSessions}
      />

      <ClassProgressSection 
        classDetails={classDetails}
        completionRate={completionRate}
      />

      <ClassManagementTabs
        classDetails={classDetails}
        selectedSessionFilter={selectedSessionFilter}
        onSessionFilterChange={setSelectedSessionFilter}
        onEditSession={handleEditSession}
        onDeleteSession={handleDeleteSession}
        onNewSession={handleNewSession}
        onEditMaterial={handleEditMaterial}
        onNewMaterial={handleNewMaterial}
      />

      <ClassDialogs
        classDetails={classDetails}
        classId={id!}
        sessionDialogOpen={sessionDialogOpen}
        setSessionDialogOpen={setSessionDialogOpen}
        materialDialogOpen={materialDialogOpen}
        setMaterialDialogOpen={setMaterialDialogOpen}
        selectedSession={selectedSession}
        selectedMaterial={selectedMaterial}
        isNewSession={isNewSession}
        nextSessionNumber={getNextSessionNumber(classDetails)}
        onSuccess={refetch}
      />
    </div>
  );
};

export default ClassManageDetails;
