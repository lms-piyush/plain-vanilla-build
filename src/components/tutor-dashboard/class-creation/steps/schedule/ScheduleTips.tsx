
import { Frequency } from "@/hooks/use-class-creation-store";

interface ScheduleTipsProps {
  frequency?: Frequency | null;
}

const ScheduleTips = ({ frequency }: ScheduleTipsProps) => {
  return (
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
  );
};

export default ScheduleTips;
