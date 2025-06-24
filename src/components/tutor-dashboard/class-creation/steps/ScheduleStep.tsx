
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
import { Plus, X } from "lucide-react";

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
  { value: "monthly", label: "Monthly" }
];

interface DailyTimeSlot {
  startTime: string;
  endTime: string;
}

interface WeeklyTimeSlot {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

interface MonthlyDate {
  dayOfMonth: number;
  startTime: string;
  endTime: string;
}

const ScheduleStep = ({ onNext, onBack }: ScheduleStepProps) => {
  const { 
    formState, 
    setSchedule, 
    setTimeSlots
  } = useClassCreationStore();
  
  const [frequency, setFrequency] = useState<Frequency | null>(formState.frequency || null);
  const [startDate, setStartDate] = useState(formState.startDate || "");
  const [endDate, setEndDate] = useState(formState.endDate || "");
  
  // Daily frequency state
  const [dailyTimeSlots, setDailyTimeSlots] = useState<DailyTimeSlot[]>([
    { startTime: "09:00", endTime: "10:00" }
  ]);
  
  // Weekly frequency state
  const [weeklyTimeSlots, setWeeklyTimeSlots] = useState<WeeklyTimeSlot[]>([
    { dayOfWeek: "monday", startTime: "09:00", endTime: "10:00" }
  ]);
  
  // Monthly frequency state
  const [monthlyDates, setMonthlyDates] = useState<MonthlyDate[]>([
    { dayOfMonth: 1, startTime: "09:00", endTime: "10:00" }
  ]);
  
  const [errors, setErrors] = useState({
    frequency: "",
    startDate: "",
    endDate: "",
    timeSlots: ""
  });
  
  const validateForm = () => {
    const newErrors = {
      frequency: formState.durationType === "recurring" && !frequency ? "Frequency is required for recurring classes" : "",
      startDate: !startDate ? "Start date is required" : "",
      endDate: "",
      timeSlots: ""
    };
    
    // Validate date range if end date is provided
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    
    // Validate time slots based on frequency
    if (frequency === "daily") {
      const hasInvalidSlots = dailyTimeSlots.some(slot => 
        !slot.startTime || !slot.endTime || slot.startTime >= slot.endTime
      );
      if (hasInvalidSlots) {
        newErrors.timeSlots = "All time slots must have valid start and end times";
      }
    } else if (frequency === "weekly") {
      const hasInvalidSlots = weeklyTimeSlots.some(slot => 
        !slot.dayOfWeek || !slot.startTime || !slot.endTime || slot.startTime >= slot.endTime
      );
      if (hasInvalidSlots) {
        newErrors.timeSlots = "All time slots must have valid day and times";
      }
    } else if (frequency === "monthly") {
      const hasInvalidSlots = monthlyDates.some(slot => 
        !slot.dayOfMonth || slot.dayOfMonth < 1 || slot.dayOfMonth > 31 || 
        !slot.startTime || !slot.endTime || slot.startTime >= slot.endTime
      );
      if (hasInvalidSlots) {
        newErrors.timeSlots = "All monthly dates must have valid day and times";
      }
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
      
      // Convert frequency-specific slots to standard TimeSlot format
      let timeSlots: TimeSlot[] = [];
      
      if (frequency === "daily") {
        // For daily, we'll use Monday as the day and store multiple time slots
        timeSlots = dailyTimeSlots.map(slot => ({
          dayOfWeek: "monday",
          startTime: slot.startTime,
          endTime: slot.endTime
        }));
      } else if (frequency === "weekly") {
        timeSlots = weeklyTimeSlots.map(slot => ({
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime
        }));
      } else if (frequency === "monthly") {
        // For monthly, we'll use the day of month as a special encoding
        timeSlots = monthlyDates.map(slot => ({
          dayOfWeek: "monday", // Will be handled specially in backend
          startTime: slot.startTime,
          endTime: slot.endTime
        }));
      }
      
      setTimeSlots(timeSlots);
      onNext();
    }
  };
  
  const addDailyTimeSlot = () => {
    setDailyTimeSlots([...dailyTimeSlots, { startTime: "09:00", endTime: "10:00" }]);
  };
  
  const removeDailyTimeSlot = (index: number) => {
    setDailyTimeSlots(dailyTimeSlots.filter((_, i) => i !== index));
  };
  
  const updateDailyTimeSlot = (index: number, field: keyof DailyTimeSlot, value: string) => {
    const updated = [...dailyTimeSlots];
    updated[index][field] = value;
    setDailyTimeSlots(updated);
  };
  
  const addWeeklyTimeSlot = () => {
    setWeeklyTimeSlots([...weeklyTimeSlots, { dayOfWeek: "monday", startTime: "09:00", endTime: "10:00" }]);
  };
  
  const removeWeeklyTimeSlot = (index: number) => {
    setWeeklyTimeSlots(weeklyTimeSlots.filter((_, i) => i !== index));
  };
  
  const updateWeeklyTimeSlot = (index: number, field: keyof WeeklyTimeSlot, value: string | DayOfWeek) => {
    const updated = [...weeklyTimeSlots];
    if (field === 'dayOfWeek') {
      updated[index][field] = value as DayOfWeek;
    } else {
      updated[index][field] = value as string;
    }
    setWeeklyTimeSlots(updated);
  };
  
  const addMonthlyDate = () => {
    setMonthlyDates([...monthlyDates, { dayOfMonth: 1, startTime: "09:00", endTime: "10:00" }]);
  };
  
  const removeMonthlyDate = (index: number) => {
    setMonthlyDates(monthlyDates.filter((_, i) => i !== index));
  };
  
  const updateMonthlyDate = (index: number, field: keyof MonthlyDate, value: string | number) => {
    const updated = [...monthlyDates];
    if (field === 'dayOfMonth') {
      updated[index][field] = value as number;
    } else {
      updated[index][field] = value as string;
    }
    setMonthlyDates(updated);
  };
  
  const renderFrequencyFields = () => {
    if (!frequency) return null;
    
    switch (frequency) {
      case "daily":
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
                  onClick={addDailyTimeSlot}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Time
                </Button>
              </div>
              
              {dailyTimeSlots.map((slot, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-md">
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <div>
                      <Label className="text-sm">Start Time</Label>
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateDailyTimeSlot(index, "startTime", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">End Time</Label>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateDailyTimeSlot(index, "endTime", e.target.value)}
                      />
                    </div>
                  </div>
                  {dailyTimeSlots.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeDailyTimeSlot(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case "weekly":
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Weekly Schedule</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addWeeklyTimeSlot}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Day
                </Button>
              </div>
              
              {weeklyTimeSlots.map((slot, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-md">
                  <div className="grid grid-cols-3 gap-3 flex-1">
                    <div>
                      <Label className="text-sm">Day of Week</Label>
                      <Select
                        value={slot.dayOfWeek}
                        onValueChange={(value) => updateWeeklyTimeSlot(index, "dayOfWeek", value as DayOfWeek)}
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
                        onChange={(e) => updateWeeklyTimeSlot(index, "startTime", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">End Time</Label>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateWeeklyTimeSlot(index, "endTime", e.target.value)}
                      />
                    </div>
                  </div>
                  {weeklyTimeSlots.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeWeeklyTimeSlot(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case "monthly":
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Monthly Schedule</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMonthlyDate}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Date
                </Button>
              </div>
              
              {monthlyDates.map((slot, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-md">
                  <div className="grid grid-cols-3 gap-3 flex-1">
                    <div>
                      <Label className="text-sm">Day of Month</Label>
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        value={slot.dayOfMonth}
                        onChange={(e) => updateMonthlyDate(index, "dayOfMonth", parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Start Time</Label>
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateMonthlyDate(index, "startTime", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">End Time</Label>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateMonthlyDate(index, "endTime", e.target.value)}
                      />
                    </div>
                  </div>
                  {monthlyDates.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeMonthlyDate(index)}
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
        
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6 pb-20">
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
        </div>
        
        <div className="space-y-4">
          {renderFrequencyFields()}
          {errors.timeSlots && (
            <p className="text-red-500 text-sm">{errors.timeSlots}</p>
          )}
          
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-medium text-[#1F4E79] mb-2">Schedule Tips</h4>
            <ul className="text-sm space-y-2 list-disc list-inside text-gray-700">
              <li>Choose consistent times for better student retention</li>
              <li>Consider time zones if teaching internationally</li>
              <li>You can add multiple time slots for more flexibility</li>
              {frequency === "daily" && (
                <li>Daily classes will occur at all specified times every day</li>
              )}
              {frequency === "weekly" && (
                <li>Weekly classes will occur on all selected days each week</li>
              )}
              {frequency === "monthly" && (
                <li>Monthly classes will occur on all specified dates each month</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Fixed positioning for buttons to ensure visibility */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 md:relative md:bg-transparent md:border-t-0 md:p-0 md:z-auto">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="w-24"
          >
            Back
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-[#1F4E79] hover:bg-[#1a4369] w-32"
          >
            Continue to Pricing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleStep;
