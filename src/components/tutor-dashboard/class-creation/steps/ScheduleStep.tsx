
import { useState, useEffect } from "react";
import { 
  useClassCreationStore, 
  TimeSlot, 
  DayOfWeek,
  Frequency 
} from "@/hooks/use-class-creation-store";
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
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

interface ScheduleStepProps {
  onNext: () => void;
  onBack: () => void;
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

const frequencies: { value: Frequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" }
];

const ScheduleStep = ({ onNext, onBack }: ScheduleStepProps) => {
  const { 
    formState, 
    setSchedule, 
    addTimeSlot, 
    removeTimeSlot, 
    updateTimeSlot 
  } = useClassCreationStore();
  
  const [frequency, setFrequency] = useState<Frequency | null>(formState.frequency || null);
  const [startDate, setStartDate] = useState(formState.startDate || "");
  const [endDate, setEndDate] = useState(formState.endDate || "");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("monday");
  const [dayOfMonth, setDayOfMonth] = useState("1");
  const [skipFirstWeek, setSkipFirstWeek] = useState(false);
  
  const [errors, setErrors] = useState({
    frequency: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    selectedDay: "",
    dayOfMonth: ""
  });
  
  const validateForm = () => {
    const newErrors = {
      frequency: formState.durationType === "recurring" && !frequency ? "Frequency is required for recurring classes" : "",
      startDate: !startDate ? "Start date is required" : "",
      endDate: "",
      startTime: !startTime ? "Start time is required" : "",
      endTime: !endTime ? "End time is required" : "",
      selectedDay: (frequency === "weekly" || frequency === "biweekly") && !selectedDay ? "Day of week is required" : "",
      dayOfMonth: frequency === "monthly" && (!dayOfMonth || parseInt(dayOfMonth) < 1 || parseInt(dayOfMonth) > 31) ? "Valid day of month is required (1-31)" : ""
    };
    
    // Validate date range if end date is provided
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    
    // Validate time range
    if (startTime && endTime && startTime >= endTime) {
      newErrors.endTime = "End time must be after start time";
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleNext = () => {
    if (validateForm()) {
      setSchedule({
        frequency: formState.durationType === "recurring" ? frequency : null,
        startDate,
        endDate: endDate || null,
        totalSessions: null
      });
      
      // Clear existing time slots and add new one based on frequency
      formState.timeSlots.forEach((_, index) => {
        removeTimeSlot(0);
      });
      
      // Create time slot based on frequency
      const timeSlot: TimeSlot = {
        dayOfWeek: frequency === "daily" ? "monday" : selectedDay, // For daily, we'll handle this differently in backend
        startTime,
        endTime
      };
      
      addTimeSlot(timeSlot);
      
      onNext();
    }
  };
  
  const renderFrequencyFields = () => {
    if (!frequency) return null;
    
    switch (frequency) {
      case "daily":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                Daily classes will occur every day at the specified time between the start and end dates.
              </p>
            </div>
          </div>
        );
        
      case "weekly":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base">
                Day of the Week <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedDay}
                onValueChange={(value) => setSelectedDay(value as DayOfWeek)}
              >
                <SelectTrigger className={errors.selectedDay ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.selectedDay && (
                <p className="text-red-500 text-sm">{errors.selectedDay}</p>
              )}
            </div>
          </div>
        );
        
      case "biweekly":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base">
                Day of the Week <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedDay}
                onValueChange={(value) => setSelectedDay(value as DayOfWeek)}
              >
                <SelectTrigger className={errors.selectedDay ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.selectedDay && (
                <p className="text-red-500 text-sm">{errors.selectedDay}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="skip-first-week"
                checked={skipFirstWeek}
                onCheckedChange={(checked) => setSkipFirstWeek(checked === true)}
              />
              <Label htmlFor="skip-first-week" className="text-sm">
                Skip first week (custom biweekly pattern)
              </Label>
            </div>
          </div>
        );
        
      case "monthly":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="day-of-month" className="text-base">
                Day of Month <span className="text-red-500">*</span>
              </Label>
              <Input
                id="day-of-month"
                type="number"
                min="1"
                max="31"
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(e.target.value)}
                placeholder="15"
                className={errors.dayOfMonth ? "border-red-500" : ""}
              />
              {errors.dayOfMonth && (
                <p className="text-red-500 text-sm">{errors.dayOfMonth}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter the day of the month (1-31) when the class should occur
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {formState.durationType === "recurring" && (
            <div className="space-y-2">
              <Label htmlFor="frequency" className="text-base">
                Class Frequency <span className="text-red-500">*</span>
              </Label>
              <Select
                value={frequency || ""}
                onValueChange={(value) => setFrequency(value as Frequency)}
              >
                <SelectTrigger className={errors.frequency ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.frequency && (
                <p className="text-red-500 text-sm">{errors.frequency}</p>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-base">
              Start Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              min={format(new Date(), 'yyyy-MM-dd')}
              onChange={(e) => setStartDate(e.target.value)}
              className={errors.startDate ? "border-red-500" : ""}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate}</p>
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
              onChange={(e) => setEndDate(e.target.value)}
              className={errors.endDate ? "border-red-500" : ""}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Leave empty for ongoing classes
            </p>
          </div>
          
          {renderFrequencyFields()}
        </div>
        
        <div className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-medium">Class Time</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-base">
                  Start Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={errors.startTime ? "border-red-500" : ""}
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm">{errors.startTime}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-base">
                  End Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={errors.endTime ? "border-red-500" : ""}
                />
                {errors.endTime && (
                  <p className="text-red-500 text-sm">{errors.endTime}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-medium text-[#1F4E79] mb-2">Schedule Tips</h4>
            <ul className="text-sm space-y-2 list-disc list-inside text-gray-700">
              <li>Choose consistent times for better student retention</li>
              <li>Consider time zones if teaching internationally</li>
              <li>Sessions will be automatically calculated based on your schedule</li>
              {frequency === "daily" && (
                <li>Daily classes will occur every day between start and end dates</li>
              )}
              {frequency === "weekly" && (
                <li>Weekly classes will occur every week on the selected day</li>
              )}
              {frequency === "biweekly" && (
                <li>Bi-weekly classes will occur every 2 weeks on the selected day</li>
              )}
              {frequency === "monthly" && (
                <li>Monthly classes will occur on the same day each month</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          onClick={handleNext}
          className="bg-[#1F4E79] hover:bg-[#1a4369]"
        >
          Continue to Pricing
        </Button>
      </div>
    </div>
  );
};

export default ScheduleStep;
