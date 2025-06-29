
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  enrollmentDeadline: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onEnrollmentDeadlineChange: (date: string) => void;
  startDateError?: string;
  endDateError?: string;
  enrollmentDeadlineError?: string;
}

const DateRangeSelector = ({
  startDate,
  endDate,
  enrollmentDeadline,
  onStartDateChange,
  onEndDateChange,
  onEnrollmentDeadlineChange,
  startDateError,
  endDateError,
  enrollmentDeadlineError
}: DateRangeSelectorProps) => {
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-[#1F4E79]">Class Schedule</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start-date">Start Date *</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            min={today}
            className={startDateError ? "border-red-500" : ""}
          />
          {startDateError && (
            <p className="text-red-500 text-sm mt-1">{startDateError}</p>
          )}
        </div>

        <div>
          <Label htmlFor="enrollment-deadline">Last Date to Enroll *</Label>
          <Input
            id="enrollment-deadline"
            type="date"
            value={enrollmentDeadline}
            onChange={(e) => onEnrollmentDeadlineChange(e.target.value)}
            min={today}
            max={startDate || undefined}
            className={enrollmentDeadlineError ? "border-red-500" : ""}
          />
          {enrollmentDeadlineError && (
            <p className="text-red-500 text-sm mt-1">{enrollmentDeadlineError}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Students can enroll until this date
          </p>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="end-date">End Date *</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            min={startDate || today}
            className={endDateError ? "border-red-500" : ""}
          />
          {endDateError && (
            <p className="text-red-500 text-sm mt-1">{endDateError}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Leave empty for ongoing classes
          </p>
        </div>
      </div>
    </div>
  );
};

export default DateRangeSelector;
