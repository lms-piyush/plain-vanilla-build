
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TutorClass } from '@/hooks/use-tutor-classes';
import ClassCardHeader from './ClassCardHeader';
import ClassCardContent from './ClassCardContent';
import ClassCardActions from './ClassCardActions';

interface ClassCardProps {
  classItem: TutorClass;
  onEdit: (classItem: TutorClass) => void;
  onManage: (classItem: TutorClass) => void;
  onDelete: (classItem: TutorClass) => void;
}

const ClassCard = ({ classItem, onEdit, onManage, onDelete }: ClassCardProps) => {
  const handleDeleteClick = () => {
    onDelete(classItem);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow border-[#1F4E79]/10">
      <ClassCardHeader 
        status={classItem.status}
        deliveryMode={classItem.delivery_mode}
        classSize={classItem.class_size}
        thumbnailUrl={classItem.thumbnail_url}
      />
      <CardContent className="flex-1 flex flex-col p-4">
        <ClassCardContent classItem={classItem} />
        
        <div className="mt-auto flex justify-between items-center pt-4">
          <ClassCardActions
            classItem={classItem}
            onEdit={onEdit}
            onManage={onManage}
            onDeleteClick={handleDeleteClick}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassCard;
