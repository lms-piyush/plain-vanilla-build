import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface LearningObjectivesProps {
  objectives: string[];
  onObjectiveChange: (index: number, value: string) => void;
  onAddObjective: () => void;
  onRemoveObjective: (index: number) => void;
}

const LearningObjectives = ({
  objectives,
  onObjectiveChange,
  onAddObjective,
  onRemoveObjective
}: LearningObjectivesProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>Learning Objectives</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddObjective}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Objective
        </Button>
      </div>
      <div className="space-y-2">
        {objectives.map((objective, objIndex) => (
          <div key={objIndex} className="flex items-center space-x-2">
            <Input
              value={objective}
              onChange={(e) => onObjectiveChange(objIndex, e.target.value)}
              placeholder="Enter learning objective"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveObjective(objIndex)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningObjectives;