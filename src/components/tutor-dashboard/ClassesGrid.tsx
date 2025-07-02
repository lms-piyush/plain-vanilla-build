
import React from 'react';
import { TutorClass } from '@/hooks/use-tutor-classes';
import ClassCard from './ClassCard';

interface ClassesGridProps {
  classes: TutorClass[];
  onEditClass: (classItem: TutorClass) => void;
  onManageClass: (classItem: TutorClass) => void;
  onCreateClass: () => void;
  onDeleteClass: (classItem: TutorClass) => void;
  onUploadClass?: (classItem: TutorClass) => void;
}

const ClassesGrid = ({ 
  classes, 
  onEditClass, 
  onManageClass, 
  onCreateClass, 
  onDeleteClass,
  onUploadClass 
}: ClassesGridProps) => {
  if (classes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No classes yet</h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first class. Share your knowledge and connect with students.
          </p>
          <button
            onClick={onCreateClass}
            className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Create Your First Class
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((classItem) => (
        <ClassCard
          key={classItem.id}
          classItem={classItem}
          onEdit={onEditClass}
          onManage={onManageClass}
          onDelete={onDeleteClass}
          onUpload={onUploadClass}
        />
      ))}
    </div>
  );
};

export default ClassesGrid;
