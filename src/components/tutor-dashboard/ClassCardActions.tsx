
import React from 'react';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TutorClass } from '@/hooks/use-tutor-classes';

interface ClassCardActionsProps {
  classItem: TutorClass;
}

const ClassCardActions = ({ classItem }: ClassCardActionsProps) => {
  return (
    <div className="flex gap-2">
      <Link 
        to={`/tutor-dashboard/classes/${classItem.id}`}
        className="flex-1 bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors flex items-center justify-center"
      >
        <Settings className="h-4 w-4 mr-1" />
        Manage Class
      </Link>
    </div>
  );
};

export default ClassCardActions;
