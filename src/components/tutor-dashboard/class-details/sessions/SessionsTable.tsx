
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClassDetails } from "@/types/class-details";
import SessionStatusBadge from "./SessionStatusBadge";
import SessionRowActions from "./SessionRowActions";

interface SessionsTableProps {
  sortedSessions: any[];
  classDetails: ClassDetails;
  onEditSession: (session: any) => void;
  onDeleteSession: (sessionId: string) => void;
  onAttendanceClick: (session: any) => void;
}

const SessionsTable = ({ 
  sortedSessions, 
  classDetails, 
  onEditSession, 
  onDeleteSession, 
  onAttendanceClick 
}: SessionsTableProps) => {
  const getSessionStatus = (session: any, index: number, totalSessions: number) => {
    if (session.status) return session.status;
    
    // Check if this is the upcoming session based on frequency calculation
    const today = new Date();
    const sessionDate = session.session_date ? new Date(session.session_date) : calculateSessionDate(index);
    
    if (sessionDate > today) {
      return 'upcoming';
    } else if (sessionDate.toDateString() === today.toDateString()) {
      return 'upcoming'; // Today's session is also upcoming
    } else {
      return 'completed';
    }
  };

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

  const getSessionDate = (session: any, index: number) => {
    if (session.session_date) {
      return new Date(session.session_date).toLocaleDateString();
    }

    return calculateSessionDate(index).toLocaleDateString();
  };

  const getSessionTime = (session: any) => {
    if (session.start_time && session.end_time) {
      return `${session.start_time} - ${session.end_time}`;
    }
    
    if (!classDetails.class_time_slots?.[0]) {
      return '4:00 PM - 5:30 PM';
    }
    const timeSlot = classDetails.class_time_slots[0];
    return `${timeSlot.start_time} - ${timeSlot.end_time}`;
  };

  const getMaterialsCount = (sessionId: string) => {
    const session = classDetails.class_syllabus?.find(s => s.id === sessionId);
    return session?.lesson_materials?.length || 0;
  };

  const getAttendanceDisplay = (session: any, status: string) => {
    if (status === 'completed') {
      return session.attendance || 'Present';
    }
    return '-';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="font-medium">Session Title</TableHead>
            <TableHead className="font-medium">Date</TableHead>
            <TableHead className="font-medium">Time</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="font-medium">Attendance</TableHead>
            <TableHead className="font-medium">Materials</TableHead>
            <TableHead className="font-medium">Notes</TableHead>
            <TableHead className="font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSessions.map((session, index) => {
            const status = getSessionStatus(session, index, sortedSessions.length);
            const materialsCount = getMaterialsCount(session.id);
            
            return (
              <TableRow key={session.id} className="hover:bg-gray-50/50">
                <TableCell className="font-medium">
                  {session.title}
                </TableCell>
                <TableCell>
                  {getSessionDate(session, index)}
                </TableCell>
                <TableCell>
                  {getSessionTime(session)}
                </TableCell>
                <TableCell>
                  <SessionStatusBadge status={status} />
                </TableCell>
                <TableCell>
                  {getAttendanceDisplay(session, status)}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {materialsCount}
                  </span>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {session.notes || (status === 'completed' 
                    ? session.description || 'Good progress with session content...'
                    : '-'
                  )}
                </TableCell>
                <TableCell>
                  <SessionRowActions
                    session={session}
                    status={status}
                    onEditSession={onEditSession}
                    onDeleteSession={onDeleteSession}
                    onAttendanceClick={onAttendanceClick}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SessionsTable;
