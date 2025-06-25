
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { ClassDetails } from "@/hooks/use-class-details";

interface SessionsTabProps {
  classDetails: ClassDetails;
  onEditSession: (session: any) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewSession: () => void;
}

const SessionsTab = ({ classDetails, onEditSession, onDeleteSession, onNewSession }: SessionsTabProps) => {
  const getSessionStatus = (sessionIndex: number, totalSessions: number) => {
    // Mark the last session as upcoming, others as completed
    if (sessionIndex === totalSessions - 1) {
      return 'Upcoming';
    }
    return 'Completed';
  };

  const getSessionDate = (session: any, index: number) => {
    if (!classDetails.class_schedules?.[0]) {
      return new Date().toLocaleDateString();
    }

    const schedule = classDetails.class_schedules[0];
    const startDate = new Date(schedule.start_date || new Date());
    
    // Calculate session date based on frequency and index
    const sessionDate = new Date(startDate);
    if (schedule.frequency === 'weekly') {
      sessionDate.setDate(startDate.getDate() + (index * 7));
    } else if (schedule.frequency === 'daily') {
      sessionDate.setDate(startDate.getDate() + index);
    } else if (schedule.frequency === 'monthly') {
      sessionDate.setMonth(startDate.getMonth() + index);
    }

    return sessionDate.toLocaleDateString();
  };

  const getSessionTime = () => {
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Materials</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classDetails.class_syllabus.map((session, index) => {
                const status = getSessionStatus(index, classDetails.class_syllabus!.length);
                const materialsCount = getMaterialsCount(session.id);
                
                return (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {session.title}
                    </TableCell>
                    <TableCell>
                      {getSessionDate(session, index)}
                    </TableCell>
                    <TableCell>
                      {getSessionTime()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={status === 'Upcoming' ? 'default' : 'secondary'}
                        className={status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {status === 'Completed' ? 'Present' : '-'}
                    </TableCell>
                    <TableCell>
                      {materialsCount}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {status === 'Completed' 
                        ? session.description || 'Good progress with session content...'
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {status === 'Upcoming' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditSession(session)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeleteSession(session.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
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
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No sessions created yet</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={onNewSession}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First Session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionsTab;
