
import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { TutorClass } from '@/hooks/use-tutor-classes';

interface ClassCardActionsProps {
  classItem: TutorClass;
  onEdit: (classItem: TutorClass) => void;
  onManage: (classItem: TutorClass) => void;
  onDeleteClick: () => void;
}

const ClassCardActions = ({ classItem, onEdit, onManage, onDeleteClick }: ClassCardActionsProps) => {
  return (
    <div className="flex gap-2">
      <button 
        onClick={() => onManage(classItem)}
        className="flex-1 bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors flex items-center justify-center"
      >
        <Eye className="h-4 w-4 mr-1" />
        Manage
      </button>
      <button 
        onClick={() => onEdit(classItem)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
      >
        <Edit className="h-4 w-4" />
      </button>
      <button 
        onClick={onDeleteClick}
        className="px-3 py-2 border border-red-300 text-red-600 rounded-md text-sm hover:bg-red-50 transition-colors flex items-center justify-center"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ClassCardActions;
