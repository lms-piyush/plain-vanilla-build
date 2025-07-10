import React from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, Plus, RotateCcw } from 'lucide-react';

interface AutoGenerationControlsProps {
  canGenerate: boolean;
  hasSessions: boolean;
  frequency?: string;
  startDate?: Date;
  endDate?: Date;
  onAutoGenerate: () => void;
  onExtendSessions: () => void;
  onClearAll: () => void;
}

const AutoGenerationControls = ({
  canGenerate,
  hasSessions,
  frequency,
  startDate,
  endDate,
  onAutoGenerate,
  onExtendSessions,
  onClearAll
}: AutoGenerationControlsProps) => {
  if (!canGenerate) return null;

  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-sm">Auto-generate Sessions</h4>
          <p className="text-xs text-muted-foreground">
            Based on your schedule: {frequency} from {startDate?.toLocaleDateString()} to {endDate?.toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAutoGenerate}
            disabled={!canGenerate}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Generate All
          </Button>
          {hasSessions && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onExtendSessions}
              >
                <Plus className="h-4 w-4 mr-2" />
                Extend
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onClearAll}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoGenerationControls;