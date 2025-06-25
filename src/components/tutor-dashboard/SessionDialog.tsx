
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClassSessions } from "@/hooks/use-class-sessions";

interface SessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: any;
  classId: string;
  onSuccess: () => void;
}

const SessionDialog = ({ open, onOpenChange, session, classId, onSuccess }: SessionDialogProps) => {
  const { createSession, updateSession, isLoading } = useClassSessions();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    week_number: 1,
    session_date: '',
    start_time: '',
    end_time: '',
    status: 'upcoming' as 'scheduled' | 'completed' | 'cancelled' | 'upcoming',
    attendance: '',
    notes: '',
  });

  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title || '',
        description: session.description || '',
        week_number: session.week_number || 1,
        session_date: session.session_date || '',
        start_time: session.start_time || '',
        end_time: session.end_time || '',
        status: session.status || 'upcoming',
        attendance: session.attendance || '',
        notes: session.notes || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        week_number: 1,
        session_date: '',
        start_time: '',
        end_time: '',
        status: 'upcoming',
        attendance: '',
        notes: '',
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (session) {
        await updateSession(session.id, formData);
      } else {
        await createSession({
          ...formData,
          class_id: classId,
          session_date: formData.session_date || new Date().toISOString(),
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
          <DialogTitle>{session ? 'Edit Session' : 'Create New Session'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Session Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter session title"
              required
            />
          </div>

          <div>
            <Label htmlFor="week_number">Week Number</Label>
            <Input
              id="week_number"
              type="number"
              min="1"
              value={formData.week_number}
              onChange={(e) => setFormData({ ...formData, week_number: parseInt(e.target.value) || 1 })}
              required
            />
          </div>

          <div>
            <Label htmlFor="session_date">Session Date</Label>
            <Input
              id="session_date"
              type="date"
              value={formData.session_date}
              onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: 'scheduled' | 'completed' | 'cancelled' | 'upcoming') => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.status === 'completed' && (
            <div>
              <Label htmlFor="attendance">Attendance</Label>
              <Select 
                value={formData.attendance} 
                onValueChange={(value) => setFormData({ ...formData, attendance: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select attendance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Enter session notes"
              rows={3}
            />
          </div>

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
