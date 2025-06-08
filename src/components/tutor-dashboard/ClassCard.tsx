
import React, { useState } from 'react';
import { TutorClass } from '@/hooks/use-tutor-classes';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(classItem);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <ClassCardHeader 
          status={classItem.status}
          deliveryMode={classItem.delivery_mode}
          classSize={classItem.class_size}
        />
        
        <ClassCardContent classItem={classItem} />
        
        <div className="px-4 pb-4">
          <ClassCardActions
            classItem={classItem}
            onEdit={onEdit}
            onManage={onManage}
            onDeleteClick={handleDeleteClick}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{classItem.title}"? This action cannot be undone and will permanently remove the class and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClassCard;
