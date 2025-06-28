
import ClassHeader from "./ClassHeader";
import StatsGrid from "./StatsGrid";
import { ClassDetails } from "@/types/class-details";

interface ClassManagementHeaderProps {
  classDetails: ClassDetails;
  enrolledCount: number;
  completedSessions: number;
  totalSessions: number;
}

const ClassManagementHeader = ({ 
  classDetails, 
  enrolledCount, 
  completedSessions, 
  totalSessions 
}: ClassManagementHeaderProps) => {
  return (
    <>
      <ClassHeader classDetails={classDetails} />
      <StatsGrid 
        classDetails={classDetails}
        enrolledCount={enrolledCount}
        completedSessions={completedSessions}
        totalSessions={totalSessions}
      />
    </>
  );
};

export default ClassManagementHeader;
