
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, Users } from "lucide-react";

interface SessionRowActionsProps {
  session: any;
  status: string;
  onEditSession: (session: any) => void;
  onDeleteSession: (sessionId: string) => void;
  onAttendanceClick: (session: any) => void;
}

const SessionRowActions = ({ 
  session, 
  status, 
  onEditSession, 
  onDeleteSession, 
  onAttendanceClick 
}: SessionRowActionsProps) => {
  return (
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
        onClick={() => onAttendanceClick(session)}
        className="h-8 w-8 p-0"
        title="Mark attendance"
      >
        <Users className="h-4 w-4" />
      </Button>
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
  );
};

export default SessionRowActions;
