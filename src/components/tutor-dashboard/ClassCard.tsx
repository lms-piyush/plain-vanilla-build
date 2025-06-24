
import React from 'react';
import { TutorClass } from '@/hooks/use-tutor-classes';
import ClassCardHeader from './ClassCardHeader';
import ClassCardContent from './ClassCardContent';
import ClassCardActions from './ClassCardActions';

interface ClassCardProps {
  classItem: TutorClass;
  onEdit: (classItem: TutorClass) => void;
  onDelete: (classItem: TutorClass) => void;
}

const ClassCard = ({ classItem, onEdit, onDelete }: ClassCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <ClassCardHeader 
        status={classItem.status}
        deliveryMode={classItem.delivery_mode}
        classSize={classItem.class_size}
        thumbnailUrl={classItem.thumbnail_url}
      />
      
      <ClassCardContent classItem={classItem} />
      
      <div className="px-4 pb-4">
        <ClassCardActions classItem={classItem} />
      </div>
    </div>
  );
};

export default ClassCard;
