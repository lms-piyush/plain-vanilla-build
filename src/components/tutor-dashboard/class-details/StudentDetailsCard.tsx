
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Calendar, Edit } from "lucide-react";
import { useConversationManagement } from "@/hooks/use-conversation-management";
import { useToast } from "@/hooks/use-toast";

interface StudentDetailsCardProps {
  student: {
    id: string;
    student_id: string;
    profiles?: {
      full_name?: string;
      email?: string;
    };
    enrollment_date: string;
    status: string;
    payment_status: string;
  };
  classId: string;
  tutorId: string;
  onClose: () => void;
}

const StudentDetailsCard = ({ student, classId, tutorId, onClose }: StudentDetailsCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { findOrCreateConversation } = useConversationManagement();
  const studentName = student.profiles?.full_name || student.profiles?.email || 'Student Name';
  const studentEmail = student.profiles?.email || 'No email available';
  
  // Mock data for detailed student info (in real app, this would come from props or API)
  const studentDetails = {
    age: 12,
    joinDate: new Date(student.enrollment_date).toLocaleDateString(),
    progress: 75,
    lastAttended: "June 11, 2023",
    parentName: "Sarah Johnson",
    parentEmail: "sarah.johnson@example.com",
    parentPhone: "+1 (555) 123-4567",
    learningStyle: "Visual learner, benefits from diagrams and illustrations",
    strengths: "Quick to grasp new concepts, creative problem-solver",
    areasForImprovement: "Sometimes rushes through exercises without careful planning",
    notes: "Alex is very engaged and asks excellent questions. Shows particular interest in game development."
  };

  const handleMessageStudent = async () => {
    try {
      const conversation = await findOrCreateConversation.mutateAsync({
        tutorId: tutorId,
        studentId: student.student_id,
        classId: classId,
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

  return (
    <Card className="border-[#1F4E79]/10">
      <CardHeader className="pb-2 px-4 pt-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-[#1F4E79]">Student Information</CardTitle>
          <CardDescription>Detailed information about the student</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs border-[#1F4E79] text-[#1F4E79] hover:bg-[#F5F7FA]"
            onClick={handleMessageStudent}
            disabled={findOrCreateConversation.isPending}
          >
            <MessageSquare className="mr-1 h-3.5 w-3.5" />
            Message Student
          </Button>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Back to List
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-6">
          {/* Student Profile */}
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24">
                <AvatarFallback>
                  {studentName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-grow space-y-4">
              <div>
                <h3 className="text-lg font-medium">{studentName}</h3>
                <p className="text-muted-foreground">{studentEmail}</p>
                <div className="flex items-center mt-1">
                  <Badge variant="outline">Age: {studentDetails.age}</Badge>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <Badge variant="outline">Joined: {studentDetails.joinDate}</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Progress</h4>
                  <div className="flex items-center gap-2">
                    <Progress value={studentDetails.progress} className="w-full bg-[#F5F7FA] h-2 [&>*]:bg-[#1F4E79]" />
                    <span className="text-sm">{studentDetails.progress}%</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Last Attended</h4>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{studentDetails.lastAttended}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Parent Contact Information */}
          <div>
            <h3 className="text-md font-medium mb-3">Parent/Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#F5F7FA] p-3 rounded-lg">
                <p className="text-sm font-medium">Name</p>
                <p>{studentDetails.parentName}</p>
              </div>
              <div className="bg-[#F5F7FA] p-3 rounded-lg">
                <p className="text-sm font-medium">Email</p>
                <p>{studentDetails.parentEmail}</p>
              </div>
              <div className="bg-[#F5F7FA] p-3 rounded-lg">
                <p className="text-sm font-medium">Phone</p>
                <p>{studentDetails.parentPhone}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Learning Profile */}
          <div>
            <h3 className="text-md font-medium mb-3">Learning Profile</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-[#F5F7FA] p-3 rounded-lg">
                <p className="text-sm font-medium mb-1">Learning Style</p>
                <p className="text-sm">{studentDetails.learningStyle}</p>
              </div>
              <div className="bg-[#F5F7FA] p-3 rounded-lg">
                <p className="text-sm font-medium mb-1">Strengths</p>
                <p className="text-sm">{studentDetails.strengths}</p>
              </div>
              <div className="bg-[#F5F7FA] p-3 rounded-lg">
                <p className="text-sm font-medium mb-1">Areas for Improvement</p>
                <p className="text-sm">{studentDetails.areasForImprovement}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Teacher Notes */}
          <div>
            <h3 className="text-md font-medium mb-3">Teacher Notes</h3>
            <div className="bg-[#F5F7FA] p-3 rounded-lg">
              <p className="text-sm">{studentDetails.notes}</p>
            </div>
            <div className="mt-3 flex justify-end">
              <Button size="sm" className="text-xs bg-[#1F4E79] hover:bg-[#1a4369]">
                <Edit className="mr-1 h-3.5 w-3.5" />
                Update Notes
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentDetailsCard;
