
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye } from "lucide-react";
import { ClassDetails } from "@/types/class-details";
import StudentDetailsCard from "./StudentDetailsCard";

interface StudentsTabProps {
  classDetails: ClassDetails;
  selectedStudent?: any;
  onStudentDeselect?: () => void;
}

const StudentsTab = ({ classDetails, selectedStudent, onStudentDeselect }: StudentsTabProps) => {
  const [currentSelectedStudent, setCurrentSelectedStudent] = useState<any>(null);

  useEffect(() => {
    if (selectedStudent) {
      setCurrentSelectedStudent(selectedStudent);
    }
  }, [selectedStudent]);

  const handleViewDetails = (student: any) => {
    setCurrentSelectedStudent(student);
  };

  const handleBackToList = () => {
    setCurrentSelectedStudent(null);
    if (onStudentDeselect) {
      onStudentDeselect();
    }
  };

  if (currentSelectedStudent) {
    return (
      <StudentDetailsCard 
        student={currentSelectedStudent} 
        onClose={handleBackToList}
      />
    );
  }

  return (
    <Card className="border-[#1F4E79]/10">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#1F4E79]">Enrolled Students</CardTitle>
        <CardDescription>Students currently enrolled in this class</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {classDetails.enrolled_students?.map((enrollment) => {
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
                      Role: {enrollment.profiles?.role || 'student'}
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
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          
          {(!classDetails.enrolled_students || classDetails.enrolled_students.length === 0) && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students enrolled yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentsTab;
