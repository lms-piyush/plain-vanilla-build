
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  });

  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title || '',
        description: session.description || '',
        week_number: session.week_number || 1,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        week_number: 1,
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
          session_date: new Date().toISOString(),
          start_time: '10:00',
          end_time: '11:00',
          status: 'scheduled' as const,
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter session description"
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
