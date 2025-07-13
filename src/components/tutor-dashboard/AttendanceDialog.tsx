
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: any;
  enrolledStudents: any[];
  onStudentClick?: (student: any) => void;
}

interface AttendanceRecord {
  student_id: string;
  status: 'present' | 'absent';
}

const AttendanceDialog = ({ open, onOpenChange, session, enrolledStudents, onStudentClick }: AttendanceDialogProps) => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && session) {
      fetchAttendance();
    }
  }, [open, session]);

  const fetchAttendance = async () => {
    if (!session) return;
    
    try {
      const { data, error } = await supabase
        .from('session_attendance')
        .select('student_id, status')
        .eq('session_id', session.id);

      if (error) throw error;

      // Initialize attendance with existing records or default to 'present'
      const attendanceMap = new Map(data?.map(record => [record.student_id, record.status]) || []);
      
      const initialAttendance = enrolledStudents.map(enrollment => ({
        student_id: enrollment.student_id,
        status: (attendanceMap.get(enrollment.student_id) || 'present') as 'present' | 'absent'
      }));

      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast({
        title: "Error",
        description: "Failed to load attendance data",
        variant: "destructive",
      });
    }
  };

  const updateAttendance = (studentId: string, status: 'present' | 'absent') => {
    setAttendance(prev => 
      prev.map(record => 
        record.student_id === studentId ? { ...record, status } : record
      )
    );
  };

  const markAllPresent = () => {
    setAttendance(prev => 
      prev.map(record => ({ ...record, status: 'present' as const }))
    );
  };

  const markAllAbsent = () => {
    setAttendance(prev => 
      prev.map(record => ({ ...record, status: 'absent' as const }))
    );
  };

  const saveAttendance = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      // Delete existing attendance records for this session
      await supabase
        .from('session_attendance')
        .delete()
        .eq('session_id', session.id);

      // Insert new attendance records
      const attendanceRecords = attendance.map(record => ({
        session_id: session.id,
        student_id: record.student_id,
        status: record.status
      }));

      const { error } = await supabase
        .from('session_attendance')
        .insert(attendanceRecords);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Attendance saved successfully",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast({
        title: "Error",
        description: "Failed to save attendance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = (studentId: string) => {
    const enrollment = enrolledStudents.find(e => e.student_id === studentId);
    return enrollment?.profiles?.full_name || `Student ${studentId.slice(-4)}`;
  };

  const handleStudentClick = (studentId: string) => {
    const enrollment = enrolledStudents.find(e => e.student_id === studentId);
    if (enrollment && onStudentClick) {
      onStudentClick(enrollment);
      onOpenChange(false); // Close the attendance dialog
    }
  };

  if (!session) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mark Attendance - {session.title || 'Session'}</DialogTitle>
          <div className="text-sm text-muted-foreground mt-2">
            Managing attendance for students in the latest batch
          </div>
        </DialogHeader>
        
        {/* Mark All buttons */}
        <div className="flex gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
          <Button
            variant="outline"
            onClick={markAllPresent}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <CheckCircle className="h-4 w-4" />
            Mark All Present
          </Button>
          <Button
            variant="outline"
            onClick={markAllAbsent}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4" />
            Mark All Absent
          </Button>
        </div>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {attendance.map((record) => {
            const studentName = getStudentName(record.student_id);
            
            return (
              <Card key={record.student_id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {studentName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button
                          variant="ghost"
                          className="p-0 h-auto font-medium text-left hover:text-blue-600 hover:underline"
                          onClick={() => handleStudentClick(record.student_id)}
                        >
                          {studentName}
                        </Button>
                        <p className="text-sm text-muted-foreground">Click to view student details</p>
                      </div>
                    </div>
                    
                    <RadioGroup
                      value={record.status}
                      onValueChange={(value) => updateAttendance(record.student_id, value as 'present' | 'absent')}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="present" id={`present-${record.student_id}`} />
                        <Label htmlFor={`present-${record.student_id}`}>Present</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="absent" id={`absent-${record.student_id}`} />
                        <Label htmlFor={`absent-${record.student_id}`}>Absent</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={saveAttendance} disabled={loading}>
            {loading ? "Saving..." : "Save Attendance"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceDialog;
