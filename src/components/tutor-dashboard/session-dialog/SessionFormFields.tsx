
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SessionFormData } from "./SessionFormData";

interface SessionFormFieldsProps {
  formData: SessionFormData;
  setFormData: (data: SessionFormData) => void;
  isNewSession: boolean;
}

const SessionFormFields = ({ formData, setFormData, isNewSession }: SessionFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="title">Session Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter session title"
          required
        />
      </div>

      {!isNewSession && (
        <>
          <div>
            <Label htmlFor="session_number">Session Number</Label>
            <Input
              id="session_number"
              type="number"
              min="1"
              value={formData.session_number}
              onChange={(e) => setFormData({ ...formData, session_number: parseInt(e.target.value) || 1 })}
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
        </>
      )}

      <div>
        <Label htmlFor="notes">Notes {isNewSession && '*'}</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Enter session notes"
          rows={3}
          required={isNewSession}
        />
      </div>
    </>
  );
};

export default SessionFormFields;
