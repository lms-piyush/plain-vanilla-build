
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Frequency } from "@/hooks/use-class-creation-store";

interface FrequencySelectorProps {
  frequency: Frequency | null;
  onFrequencyChange: (frequency: Frequency | null) => void;
  error?: string;
  isRecurring: boolean;
}

const FrequencySelector = ({
  frequency,
  onFrequencyChange,
  error,
  isRecurring
}: FrequencySelectorProps) => {
  if (!isRecurring) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-[#1F4E79]">Class Frequency</h3>
      
      <div className="space-y-2">
        <Label htmlFor="frequency" className="text-sm font-medium text-gray-700">
          Class Frequency *
        </Label>
        <Select
          value={frequency || ""}
          onValueChange={(value) => onFrequencyChange(value as Frequency)}
        >
          <SelectTrigger className={`h-11 ${error ? "border-red-500" : "border-gray-300"}`}>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
        {error && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
      </div>

      {frequency && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-4">
          <p className="text-sm text-blue-800">
            {frequency === "daily" && "Daily classes will occur every day at the specified times between the start and end dates."}
            {frequency === "weekly" && "Weekly classes will occur on the selected days each week between the start and end dates."}
            {frequency === "monthly" && "Monthly classes will occur on the specified dates each month between the start and end dates."}
          </p>
        </div>
      )}
    </div>
  );
};

export default FrequencySelector;
