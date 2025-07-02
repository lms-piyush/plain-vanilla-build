
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
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#1F4E79]">Class Times</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddTimeSlot}
          className="flex items-center gap-2 px-3 py-1.5 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Time
        </Button>
      </div>
      
      <div className="space-y-4">
        {timeSlots.map((slot, index) => (
          <div key={index} className="flex items-end gap-3 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Start Time</Label>
                <Input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => onUpdateTimeSlot(index, "startTime", e.target.value)}
                  className="h-10 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">End Time</Label>
                <Input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => onUpdateTimeSlot(index, "endTime", e.target.value)}
                  className="h-10 border-gray-300"
                />
              </div>
            </div>
            {timeSlots.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRemoveTimeSlot(index)}
                className="h-10 w-10 p-0 flex-shrink-0"
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
