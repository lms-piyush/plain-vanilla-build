
import { Frequency } from "@/hooks/use-class-creation-store";
import { Lightbulb } from "lucide-react";

interface ScheduleTipsProps {
  frequency?: Frequency | null;
}

const ScheduleTips = ({ frequency }: ScheduleTipsProps) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-blue-900 mb-3">Schedule Tips</h4>
          <ul className="text-sm space-y-2 text-blue-800">
            <li>• Choose consistent times for better student retention</li>
            <li>• Consider time zones if teaching internationally</li>
            <li>• You can add multiple time slots for more flexibility</li>
            {frequency === "daily" && (
              <li>• Daily classes will occur at all specified times every day</li>
            )}
            {frequency === "weekly" && (
              <li>• Weekly classes will occur on all selected days each week</li>
            )}
            {frequency === "monthly" && (
              <li>• Monthly classes will occur on all specified dates each month</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTips;
