
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface MonthlyDate {
  dayOfMonth: number;
  startTime: string;
  endTime: string;
}

interface MonthlyScheduleFormProps {
  dates: MonthlyDate[];
  onAddDate: () => void;
  onRemoveDate: (index: number) => void;
  onUpdateDate: (index: number, field: keyof MonthlyDate, value: string | number) => void;
}

const MonthlyScheduleForm = ({
  dates,
  onAddDate,
  onRemoveDate,
  onUpdateDate
}: MonthlyScheduleFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base">Monthly Schedule</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddDate}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Date
          </Button>
        </div>
        
        {dates.map((slot, index) => (
          <div key={index} className="flex items-center gap-3 p-3 border rounded-md">
            <div className="grid grid-cols-3 gap-3 flex-1">
              <div>
                <Label className="text-sm">Day of Month</Label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={slot.dayOfMonth}
                  onChange={(e) => onUpdateDate(index, "dayOfMonth", parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-sm">Start Time</Label>
                <Input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => onUpdateDate(index, "startTime", e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm">End Time</Label>
                <Input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => onUpdateDate(index, "endTime", e.target.value)}
                />
              </div>
            </div>
            {dates.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRemoveDate(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 p-3 rounded-md">
        <p className="text-sm text-blue-800">
          Monthly classes will occur on the specified days of each month between the start and end dates.
        </p>
      </div>
    </div>
  );
};

export default MonthlyScheduleForm;
