
import React from 'react';
import { TutorClass } from '@/hooks/use-tutor-classes';
import ClassCardScheduleInfo from './ClassCardScheduleInfo';

interface ClassCardContentProps {
  classItem: TutorClass;
}

const ClassCardContent = ({ classItem }: ClassCardContentProps) => {
  return (
    <div className="p-4">
      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">{classItem.title}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{classItem.description || "No description available"}</p>
      
      <ClassCardScheduleInfo classItem={classItem} />
    </div>
  );
};

export default ClassCardContent;
