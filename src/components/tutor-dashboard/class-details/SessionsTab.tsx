
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ClassDetails } from "@/types/class-details";
import { fetchClassEnrollments } from "@/utils/class-enrollment-utils";
import AttendanceDialog from "../AttendanceDialog";
import SessionsHeader from "./sessions/SessionsHeader";
import SessionsTable from "./sessions/SessionsTable";
import EmptySessionsState from "./sessions/EmptySessionsState";

interface SessionsTabProps {
  classDetails: ClassDetails;
  onEditSession: (session: any) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewSession: () => void;
  onStudentSelect?: (student: any) => void;
}

const SessionsTab = ({ classDetails, onEditSession, onDeleteSession, onNewSession, onStudentSelect }: SessionsTabProps) => {
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [currentBatchStudents, setCurrentBatchStudents] = useState<any[]>([]);

  useEffect(() => {
    loadCurrentBatchStudents();
  }, [classDetails.id, classDetails.batch_number]);

  const loadCurrentBatchStudents = async () => {
    try {
      const students = await fetchClassEnrollments(classDetails.id, classDetails.batch_number);
      setCurrentBatchStudents(students);
    } catch (error) {
      console.error('Error loading current batch students:', error);
    }
  };

  const handleAttendanceClick = (session: any) => {
    setSelectedSession(session);
    setAttendanceDialogOpen(true);
  };

  const handleStudentClick = (student: any) => {
    if (onStudentSelect) {
      onStudentSelect(student);
    }
  };

  // Sort sessions by session_date in ascending order (earliest first)
  const sortedSessions = classDetails.class_syllabus ? [...classDetails.class_syllabus].sort((a, b) => {
    const calculateSessionDate = (sessionIndex: number) => {
      if (!classDetails.class_schedules?.[0]) {
        return new Date();
      }

      const schedule = classDetails.class_schedules[0];
      const startDate = new Date(schedule.start_date || new Date());
      
      // Calculate session date based on frequency and index
      const sessionDate = new Date(startDate);
      if (schedule.frequency === 'weekly') {
        sessionDate.setDate(startDate.getDate() + (sessionIndex * 7));
      } else if (schedule.frequency === 'daily') {
        sessionDate.setDate(startDate.getDate() + sessionIndex);
      } else if (schedule.frequency === 'monthly') {
        sessionDate.setMonth(startDate.getMonth() + sessionIndex);
      }

      return sessionDate;
    };

    const dateA = a.session_date ? new Date(a.session_date) : calculateSessionDate(a.week_number - 1);
    const dateB = b.session_date ? new Date(b.session_date) : calculateSessionDate(b.week_number - 1);
    return dateA.getTime() - dateB.getTime();
  }) : [];

  return (
    <>
      <Card className="border-[#1F4E79]/10">
        <SessionsHeader onNewSession={onNewSession} />
        <CardContent>
          {sortedSessions && sortedSessions.length > 0 ? (
            <SessionsTable
              sortedSessions={sortedSessions}
              classDetails={classDetails}
              onEditSession={onEditSession}
              onDeleteSession={onDeleteSession}
              onAttendanceClick={handleAttendanceClick}
            />
          ) : (
            <EmptySessionsState onNewSession={onNewSession} />
          )}
        </CardContent>
      </Card>

      <AttendanceDialog
        open={attendanceDialogOpen}
        onOpenChange={setAttendanceDialogOpen}
        session={selectedSession}
        enrolledStudents={currentBatchStudents}
        classDetails={classDetails}
        onStudentClick={handleStudentClick}
      />
    </>
  );
};

export default SessionsTab;
