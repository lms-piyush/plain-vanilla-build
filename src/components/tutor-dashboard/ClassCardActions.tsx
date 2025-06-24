
import React from 'react';
import { Settings } from 'lucide-react';
import { TutorClass } from '@/hooks/use-tutor-classes';

interface ClassCardActionsProps {
  classItem: TutorClass;
  onManageClass: (classItem: TutorClass) => void;
}

const ClassCardActions = ({ classItem, onManageClass }: ClassCardActionsProps) => {
  return (
    <div className="flex gap-2">
      <button 
        onClick={() => onManageClass(classItem)}
        className="flex-1 bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors flex items-center justify-center"
      >
        <Settings className="h-4 w-4 mr-1" />
        Manage Class
      </button>
    </div>
  );
};

export default ClassCardActions;
