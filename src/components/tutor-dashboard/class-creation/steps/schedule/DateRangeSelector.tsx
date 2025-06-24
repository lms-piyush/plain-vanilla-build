
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  startDateError?: string;
  endDateError?: string;
}

const DateRangeSelector = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startDateError,
  endDateError
}: DateRangeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="startDate" className="text-base">
          Start Date <span className="text-red-500">*</span>
        </Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          min={format(new Date(), 'yyyy-MM-dd')}
          onChange={(e) => onStartDateChange(e.target.value)}
          className={startDateError ? "border-red-500" : ""}
        />
        {startDateError && (
          <p className="text-red-500 text-sm">{startDateError}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="endDate" className="text-base">
          End Date <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          min={startDate || format(new Date(), 'yyyy-MM-dd')}
          onChange={(e) => onEndDateChange(e.target.value)}
          className={endDateError ? "border-red-500" : ""}
        />
        {endDateError && (
          <p className="text-red-500 text-sm">{endDateError}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Leave empty for ongoing classes
        </p>
      </div>
    </div>
  );
};

export default DateRangeSelector;
