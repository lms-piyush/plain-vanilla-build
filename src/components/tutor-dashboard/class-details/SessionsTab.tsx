import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { ClassDetails } from "@/types/class-details";

interface SessionsTabProps {
  classDetails: ClassDetails;
  onEditSession: (session: any) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewSession: () => void;
}

const SessionsTab = ({ classDetails, onEditSession, onDeleteSession, onNewSession }: SessionsTabProps) => {
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return '';
    }
  };

  const getNextSessionNumber = () => {
    if (!classDetails.class_syllabus || classDetails.class_syllabus.length === 0) {
      return 1;
    }
    return Math.max(...classDetails.class_syllabus.map(s => s.week_number || 1)) + 1;
  };

  return (
    <Card className="border-[#1F4E79]/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-[#1F4E79]">Sessions</CardTitle>
          <CardDescription>Manage your 1-on-1 class sessions</CardDescription>
        </div>
        <Button 
          size="sm" 
          className="text-xs bg-[#1F4E79] hover:bg-[#1a4369]"
          onClick={onNewSession}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          New Session
        </Button>
      </CardHeader>
      <CardContent>
        {classDetails.class_syllabus && classDetails.class_syllabus.length > 0 ? (
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
                {classDetails.class_syllabus.map((session, index) => {
                  const status = getSessionStatus(session, index, classDetails.class_syllabus!.length);
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
                        <Badge 
                          variant={getStatusBadgeVariant(status)}
                          className={`capitalize ${getStatusBadgeClass(status)}`}
                        >
                          {status}
                        </Badge>
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
                        <div className="flex gap-1">
                          {status === 'upcoming' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="View session"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditSession(session)}
                            className="h-8 w-8 p-0"
                            title="Edit session"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDeleteSession(session.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                            title="Delete session"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50/30 rounded-lg border-2 border-dashed border-gray-200">
            <div className="max-w-sm mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions created yet</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first session for this class.</p>
              <Button 
                variant="outline" 
                className="bg-white"
                onClick={onNewSession}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create First Session
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionsTab;
