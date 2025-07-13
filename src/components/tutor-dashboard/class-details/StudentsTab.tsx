
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Eye, Users, Filter } from "lucide-react";
import { ClassDetails } from "@/types/class-details";
import { useConversationManagement } from "@/hooks/use-conversation-management";
import { useToast } from "@/hooks/use-toast";
import { fetchClassEnrollments, fetchAllBatchNumbers } from "@/utils/class-enrollment-utils";
import StudentDetailsCard from "./StudentDetailsCard";

interface StudentsTabProps {
  classDetails: ClassDetails;
  selectedStudent?: any;
  onStudentDeselect?: () => void;
}

const StudentsTab = ({ classDetails, selectedStudent, onStudentDeselect }: StudentsTabProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { findOrCreateConversation } = useConversationManagement();
  const [currentSelectedStudent, setCurrentSelectedStudent] = useState<any>(null);
  const [selectedBatch, setSelectedBatch] = useState<number>(classDetails.batch_number);
  const [availableBatches, setAvailableBatches] = useState<number[]>([]);
  const [batchStudents, setBatchStudents] = useState<any[]>(classDetails.enrolled_students || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedStudent) {
      setCurrentSelectedStudent(selectedStudent);
    }
  }, [selectedStudent]);

  useEffect(() => {
    loadAvailableBatches();
  }, [classDetails.id]);

  useEffect(() => {
    loadBatchStudents();
  }, [selectedBatch, classDetails.id]);

  const loadAvailableBatches = async () => {
    try {
      const batches = await fetchAllBatchNumbers(classDetails.id);
      setAvailableBatches(batches);
      
      // Set latest batch as default if current selection is not available
      if (batches.length > 0 && !batches.includes(selectedBatch)) {
        setSelectedBatch(batches[0]); // First item is the latest (ordered desc)
      }
    } catch (error) {
      console.error('Error loading batch numbers:', error);
      toast({
        title: "Error",
        description: "Failed to load batch information",
        variant: "destructive",
      });
    }
  };

  const loadBatchStudents = async () => {
    setLoading(true);
    try {
      const students = await fetchClassEnrollments(classDetails.id, selectedBatch);
      setBatchStudents(students);
    } catch (error) {
      console.error('Error loading batch students:', error);
      toast({
        title: "Error",
        description: "Failed to load students for selected batch",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (student: any) => {
    setCurrentSelectedStudent(student);
  };

  const handleBackToList = () => {
    setCurrentSelectedStudent(null);
    if (onStudentDeselect) {
      onStudentDeselect();
    }
  };

  const handleMessageStudent = async (studentId: string) => {
    try {
      const conversation = await findOrCreateConversation.mutateAsync({
        tutorId: classDetails.tutor_id,
        studentId: studentId,
        classId: classDetails.id,
      });

      // Redirect to messages with the conversation ID
      navigate(`/tutor/messages?conversation=${conversation.id}`);
    } catch (error) {
      console.error("Error creating/finding conversation:", error);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (currentSelectedStudent) {
    return (
      <StudentDetailsCard 
        student={currentSelectedStudent} 
        classId={classDetails.id}
        tutorId={classDetails.tutor_id}
        onClose={handleBackToList}
      />
    );
  }

  return (
    <Card className="border-[#1F4E79]/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-[#1F4E79] flex items-center gap-2">
              <Users className="h-5 w-5" />
              Enrolled Students
            </CardTitle>
            <CardDescription>
              Students enrolled in this class by batch
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedBatch.toString()} onValueChange={(value) => setSelectedBatch(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {availableBatches.map((batch) => (
                  <SelectItem key={batch} value={batch.toString()}>
                    Batch #{batch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {batchStudents?.map((enrollment) => {
              // Use the full_name from profiles, with fallback to a generic display
              const displayName = enrollment.profiles?.full_name || `Student ${enrollment.student_id.slice(-4)}`;
              
              return (
                <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{displayName}</p>
                      <p className="text-sm text-muted-foreground">
                        Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Role: {enrollment.profiles?.role || 'student'} • Batch: #{enrollment.batch_number}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={enrollment.status === 'active' ? 'default' : 'secondary'}>
                      {enrollment.status}
                    </Badge>
                    <Badge variant={enrollment.payment_status === 'paid' ? 'default' : 'destructive'}>
                      {enrollment.payment_status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(enrollment)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleMessageStudent(enrollment.student_id)}
                      disabled={findOrCreateConversation.isPending}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {(!batchStudents || batchStudents.length === 0) && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No students enrolled in Batch #{selectedBatch}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentsTab;
