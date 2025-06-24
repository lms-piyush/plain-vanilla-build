
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DayOfWeek } from "@/hooks/use-class-creation-store";
import { Plus, X } from "lucide-react";

interface WeeklyTimeSlot {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

interface WeeklyScheduleFormProps {
  timeSlots: WeeklyTimeSlot[];
  onAddTimeSlot: () => void;
  onRemoveTimeSlot: (index: number) => void;
  onUpdateTimeSlot: (index: number, field: keyof WeeklyTimeSlot, value: string | DayOfWeek) => void;
}

const daysOfWeek: { value: DayOfWeek; label: string }[] = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" }
];

const WeeklyScheduleForm = ({
  timeSlots,
  onAddTimeSlot,
  onRemoveTimeSlot,
  onUpdateTimeSlot
}: WeeklyScheduleFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base">Weekly Schedule</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddTimeSlot}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Day
          </Button>
        </div>
        
        {timeSlots.map((slot, index) => (
          <div key={index} className="flex items-center gap-3 p-3 border rounded-md">
            <div className="grid grid-cols-3 gap-3 flex-1">
              <div>
                <Label className="text-sm">Day of Week</Label>
                <Select
                  value={slot.dayOfWeek}
                  onValueChange={(value) => onUpdateTimeSlot(index, "dayOfWeek", value as DayOfWeek)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

export default WeeklyScheduleForm;
