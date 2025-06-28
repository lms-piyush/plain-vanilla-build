
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface SessionsHeaderProps {
  onNewSession: () => void;
}

const SessionsHeader = ({ onNewSession }: SessionsHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="text-lg font-semibold text-[#1F4E79]">Sessions</CardTitle>
        <CardDescription>Manage your 1-on-1 class sessions</CardDescription>
      </div>
      <Button 
        size="sm" 
        className="text-xs bg-[#1F4E79] hover:bg-[#1a4369]"
        onClick={onNewSession}
      >
        <Plus className="mr-1 h-3.5 w-3.5" />
        New Session
      </Button>
    </CardHeader>
  );
};

export default SessionsHeader;
