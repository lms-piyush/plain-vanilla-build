
import { useState, useEffect } from "react";
import { 
  useClassCreationStore, 
  TimeSlot, 
  DayOfWeek,
  Frequency 
} from "@/hooks/use-class-creation-store";
import { Button } from "@/components/ui/button";
import FrequencySelector from "./schedule/FrequencySelector";
import DateRangeSelector from "./schedule/DateRangeSelector";
import DailyScheduleForm from "./schedule/DailyScheduleForm";
import WeeklyScheduleForm from "./schedule/WeeklyScheduleForm";
import MonthlyScheduleForm from "./schedule/MonthlyScheduleForm";
import ScheduleTips from "./schedule/ScheduleTips";

interface ScheduleStepProps {
  onNext: () => void;
  onBack: () => void;
}

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
  const store = useClassCreationStore();
  
  const [frequency, setFrequency] = useState<Frequency | null>(store.frequency || null);
  const [startDate, setStartDate] = useState(store.startDate || "");
  const [endDate, setEndDate] = useState(store.endDate || "");
  const [enrollmentDeadline, setEnrollmentDeadline] = useState(store.enrollmentDeadline || "");
  
  // Initialize state from existing store.timeSlots
  const [dailyTimeSlots, setDailyTimeSlots] = useState<DailyTimeSlot[]>(() => {
    if (store.timeSlots.length > 0 && store.frequency === "daily") {
      return store.timeSlots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime
      }));
    }
    return [{ startTime: "09:00", endTime: "10:00" }];
  });
  
  const [weeklyTimeSlots, setWeeklyTimeSlots] = useState<WeeklyTimeSlot[]>(() => {
    if (store.timeSlots.length > 0 && store.frequency === "weekly") {
      return store.timeSlots.map(slot => ({
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime
      }));
    }
    return [{ dayOfWeek: "monday", startTime: "09:00", endTime: "10:00" }];
  });
  
  const [monthlyDates, setMonthlyDates] = useState<MonthlyDate[]>(() => {
    if (store.timeSlots.length > 0 && store.frequency === "monthly") {
      return store.timeSlots.map((slot, index) => ({
        dayOfMonth: index + 1, // Default fallback
        startTime: slot.startTime,
        endTime: slot.endTime
      }));
    }
    return [{ dayOfMonth: 1, startTime: "09:00", endTime: "10:00" }];
  });
  
  const [errors, setErrors] = useState({
    frequency: "",
    startDate: "",
    endDate: "",
    enrollmentDeadline: "",
    timeSlots: ""
  });
  
  // Update local state when frequency changes
  useEffect(() => {
    if (frequency !== store.frequency && store.timeSlots.length > 0) {
      // Reset to defaults when frequency changes
      setDailyTimeSlots([{ startTime: "09:00", endTime: "10:00" }]);
      setWeeklyTimeSlots([{ dayOfWeek: "monday", startTime: "09:00", endTime: "10:00" }]);
      setMonthlyDates([{ dayOfMonth: 1, startTime: "09:00", endTime: "10:00" }]);
    }
  }, [frequency, store.frequency, store.timeSlots.length]);
  
  const validateForm = () => {
    const newErrors = {
      frequency: store.durationType === "recurring" && !frequency ? "Frequency is required for recurring classes" : "",
      startDate: !startDate ? "Start date is required" : "",
      endDate: !endDate ? "End date is required" : "",
      enrollmentDeadline: !enrollmentDeadline ? "Enrollment deadline is required" : "",
      timeSlots: ""
    };
    
    // Validate enrollment deadline
    if (enrollmentDeadline && startDate && new Date(enrollmentDeadline) >= new Date(startDate)) {
      newErrors.enrollmentDeadline = "Enrollment deadline must be before the start date";
    }
    
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
      store.setSchedule({
        frequency: store.durationType === "recurring" ? frequency : null,
        startDate,
        endDate: endDate || null,
        enrollmentDeadline,
        totalSessions: null
      });
      
      // Convert frequency-specific slots to standard TimeSlot format
      let timeSlots: TimeSlot[] = [];
      
      if (frequency === "daily") {
        timeSlots = dailyTimeSlots.map(slot => ({
          dayOfWeek: "monday", // Placeholder for daily
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
        timeSlots = monthlyDates.map(slot => ({
          dayOfWeek: "monday", // Placeholder for monthly
          startTime: slot.startTime,
          endTime: slot.endTime
        }));
      }
      
      store.setTimeSlots(timeSlots);
      onNext();
    }
  };
  
  // Daily schedule handlers
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
  
  // Weekly schedule handlers
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
  
  // Monthly schedule handlers
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
          <DailyScheduleForm
            timeSlots={dailyTimeSlots}
            onAddTimeSlot={addDailyTimeSlot}
            onRemoveTimeSlot={removeDailyTimeSlot}
            onUpdateTimeSlot={updateDailyTimeSlot}
          />
        );
        
      case "weekly":
        return (
          <WeeklyScheduleForm
            timeSlots={weeklyTimeSlots}
            onAddTimeSlot={addWeeklyTimeSlot}
            onRemoveTimeSlot={removeWeeklyTimeSlot}
            onUpdateTimeSlot={updateWeeklyTimeSlot}
          />
        );
        
      case "monthly":
        return (
          <MonthlyScheduleForm
            dates={monthlyDates}
            onAddDate={addMonthlyDate}
            onRemoveDate={removeMonthlyDate}
            onUpdateDate={updateMonthlyDate}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-8 p-6">
      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Form Controls */}
        <div className="space-y-6">
          <FrequencySelector
            frequency={frequency}
            onFrequencyChange={setFrequency}
            error={errors.frequency}
            isRecurring={store.durationType === "recurring"}
          />
          
          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            enrollmentDeadline={enrollmentDeadline}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onEnrollmentDeadlineChange={setEnrollmentDeadline}
            startDateError={errors.startDate}
            endDateError={errors.endDate}
            enrollmentDeadlineError={errors.enrollmentDeadline}
          />
        </div>
        
        {/* Right Column - Time Slots & Tips */}
        <div className="space-y-6">
          {renderFrequencyFields()}
          {errors.timeSlots && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{errors.timeSlots}</p>
            </div>
          )}
          
          <ScheduleTips frequency={frequency} />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="px-6"
        >
          Back
        </Button>
        <Button 
          onClick={handleNext}
          className="bg-[#1F4E79] hover:bg-[#1a4369] px-6"
        >
          Continue to Location
        </Button>
      </div>
    </div>
  );
};

export default ScheduleStep;
