
import React from 'react';
import { Plus } from 'lucide-react';
import ClassCard from './ClassCard';
import { TutorClass } from '@/hooks/use-tutor-classes';

interface ClassesGridProps {
  classes: TutorClass[];
  onCreateClass: () => void;
  onEdit?: (classItem: TutorClass) => void;
  onDelete?: (id: string, title: string) => void;
}

const ClassesGrid = ({ classes, onCreateClass, onEdit, onDelete }: ClassesGridProps) => {
  if (classes.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500 mb-4">No classes found. Create your first class to get started!</p>
        <button 
          onClick={onCreateClass}
          className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Create Your First Class
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((classItem) => (
        <ClassCard
          key={classItem.id}
          classItem={classItem}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ClassesGrid;
