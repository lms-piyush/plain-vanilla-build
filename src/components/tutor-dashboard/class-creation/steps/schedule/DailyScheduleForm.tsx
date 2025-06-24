
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface DailyTimeSlot {
  startTime: string;
  endTime: string;
}

interface DailyScheduleFormProps {
  timeSlots: DailyTimeSlot[];
  onAddTimeSlot: () => void;
  onRemoveTimeSlot: (index: number) => void;
  onUpdateTimeSlot: (index: number, field: keyof DailyTimeSlot, value: string) => void;
}

const DailyScheduleForm = ({
  timeSlots,
  onAddTimeSlot,
  onRemoveTimeSlot,
  onUpdateTimeSlot
}: DailyScheduleFormProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-3 rounded-md">
        <p className="text-sm text-blue-800">
          Daily classes will occur every day at the specified times between the start and end dates.
        </p>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base">Class Times</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddTimeSlot}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Time
          </Button>
        </div>
        
        {timeSlots.map((slot, index) => (
          <div key={index} className="flex items-center gap-3 p-3 border rounded-md">
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div>
                <Label className="text-sm">Start Time</Label>
                <Input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => onUpdateTimeSlot(index, "startTime", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm">End Time</Label>
                <Input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => onUpdateTimeSlot(index, "endTime", e.target.value)}
                />
              </div>
            </div>
            {timeSlots.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRemoveTimeSlot(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyScheduleForm;
