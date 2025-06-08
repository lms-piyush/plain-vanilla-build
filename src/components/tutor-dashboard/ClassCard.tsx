
import React from 'react';
import { TutorClass } from '@/hooks/use-tutor-classes';
import ClassCardHeader from './ClassCardHeader';
import ClassScheduleInfo from './ClassScheduleInfo';
import ClassCardActions from './ClassCardActions';

interface ClassCardProps {
  classItem: TutorClass;
  onEdit: (classItem: TutorClass) => void;
  onManage: (classItem: TutorClass) => void;
  onDelete: (classItem: TutorClass) => void;
}

const ClassCard = ({ classItem, onEdit, onManage, onDelete }: ClassCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <ClassCardHeader 
        deliveryMode={classItem.delivery_mode}
        classSize={classItem.class_size}
        status={classItem.status}
      />
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">{classItem.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{classItem.description || "No description available"}</p>
        
        <ClassScheduleInfo classItem={classItem} />
        
        <ClassCardActions 
          classItem={classItem}
          onEdit={onEdit}
          onManage={onManage}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default ClassCard;
