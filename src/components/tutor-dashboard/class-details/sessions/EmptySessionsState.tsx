
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptySessionsStateProps {
  onNewSession: () => void;
}

const EmptySessionsState = ({ onNewSession }: EmptySessionsStateProps) => {
  return (
    <div className="text-center py-12 bg-gray-50/30 rounded-lg border-2 border-dashed border-gray-200">
      <div className="max-w-sm mx-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions created yet</h3>
        <p className="text-muted-foreground mb-4">Get started by creating your first session for this class.</p>
        <Button 
          variant="outline" 
          className="bg-white"
          onClick={onNewSession}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create First Session
        </Button>
      </div>
    </div>
  );
};

export default EmptySessionsState;
