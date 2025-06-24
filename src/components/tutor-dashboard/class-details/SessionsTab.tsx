
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ClassDetails } from "@/hooks/use-class-details";

interface SessionsTabProps {
  classDetails: ClassDetails;
  onEditSession: (session: any) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewSession: () => void;
}

const SessionsTab = ({ classDetails, onEditSession, onDeleteSession, onNewSession }: SessionsTabProps) => {
  return (
    <Card className="border-[#1F4E79]/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-[#1F4E79]">Sessions</CardTitle>
          <CardDescription>Manage your class sessions</CardDescription>
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
        <div className="space-y-4">
          {classDetails.class_syllabus?.map((session) => (
            <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Week {session.week_number}: {session.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {session.description || "No description"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEditSession(session)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDeleteSession(session.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {(!classDetails.class_syllabus || classDetails.class_syllabus.length === 0) && (
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
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionsTab;
