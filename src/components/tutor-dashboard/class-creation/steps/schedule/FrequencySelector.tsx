
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Frequency } from "@/hooks/use-class-creation-store";

const frequencies: { value: Frequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" }
];

interface FrequencySelectorProps {
  frequency: Frequency | null;
  onFrequencyChange: (frequency: Frequency) => void;
  error?: string;
  isRecurring: boolean;
}

const FrequencySelector = ({ 
  frequency, 
  onFrequencyChange, 
  error, 
  isRecurring 
}: FrequencySelectorProps) => {
  if (!isRecurring) return null;

  return (
    <div className="space-y-2">
      <Label htmlFor="frequency" className="text-base">
        Class Frequency <span className="text-red-500">*</span>
      </Label>
      <Select
        value={frequency || ""}
        onValueChange={(value) => onFrequencyChange(value as Frequency)}
      >
        <SelectTrigger className={error ? "border-red-500" : ""}>
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
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default FrequencySelector;
