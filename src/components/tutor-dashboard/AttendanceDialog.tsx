
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: any;
  enrolledStudents: any[];
}

interface AttendanceRecord {
  student_id: string;
  status: 'present' | 'absent';
}

const AttendanceDialog = ({ open, onOpenChange, session, enrolledStudents }: AttendanceDialogProps) => {
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

  if (!session) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mark Attendance - {session.title || 'Session'}</DialogTitle>
        </DialogHeader>
        
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
                        <p className="font-medium">{studentName}</p>
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
