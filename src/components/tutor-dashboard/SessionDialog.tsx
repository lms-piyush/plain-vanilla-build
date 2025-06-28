
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useClassSessions } from "@/hooks/use-class-sessions";
import SessionFormFields from "./session-dialog/SessionFormFields";
import SessionInfoCard from "./session-dialog/SessionInfoCard";
import { SessionFormData, createInitialFormData } from "./session-dialog/SessionFormData";
import { useSessionDateTime } from "./session-dialog/useSessionDateTime";

interface SessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: any;
  classId: string;
  onSuccess: () => void;
  isNewSession?: boolean;
  nextSessionNumber?: number;
  classDetails?: any;
}

const SessionDialog = ({ 
  open, 
  onOpenChange, 
  session, 
  classId, 
  onSuccess, 
  isNewSession = false,
  nextSessionNumber = 1,
  classDetails
}: SessionDialogProps) => {
  const { createSession, updateSession, isLoading } = useClassSessions();
  const [formData, setFormData] = useState<SessionFormData>(createInitialFormData());
  
  const { date, startTime, endTime } = useSessionDateTime({ 
    classDetails, 
    nextSessionNumber 
  });

  useEffect(() => {
    if (session) {
      // Prefill existing session data
      setFormData({
        title: session.title || '',
        description: session.description || '',
        session_number: session.week_number || 1,
        session_date: session.session_date || '',
        start_time: session.start_time || '',
        end_time: session.end_time || '',
        status: session.status || 'upcoming',
        notes: session.notes || '',
      });
    } else if (isNewSession) {
      // For new sessions, auto-calculate date/time
      setFormData({
        title: '',
        description: '',
        session_number: nextSessionNumber,
        session_date: date,
        start_time: startTime,
        end_time: endTime,
        status: 'upcoming',
        notes: '',
      });
    }
  }, [session, isNewSession, nextSessionNumber, date, startTime, endTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (session) {
        await updateSession(session.id, formData);
      } else {
        await createSession({
          ...formData,
          class_id: classId,
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isNewSession ? 'Create New Session' : 'Edit Session'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <SessionFormFields 
            formData={formData}
            setFormData={setFormData}
            isNewSession={isNewSession}
          />

          {isNewSession && (
            <SessionInfoCard 
              sessionDate={formData.session_date}
              startTime={formData.start_time}
              endTime={formData.end_time}
            />
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : session ? 'Update Session' : 'Create Session'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDialog;
