
import React, { useState } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ClassCardActionsProps {
  classItem: TutorClass;
  onEdit: (classItem: TutorClass) => void;
  onManage: (classItem: TutorClass) => void;
  onDelete: (classItem: TutorClass) => void;
}

const ClassCardActions = ({ classItem, onEdit, onManage, onDelete }: ClassCardActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteConfirm = () => {
    onDelete(classItem);
    setShowDeleteDialog(false);
  };

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
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogTrigger asChild>
          <button className="px-3 py-2 border border-red-300 text-red-600 rounded-md text-sm hover:bg-red-50 transition-colors flex items-center justify-center">
            <Trash2 className="h-4 w-4" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{classItem.title}"? This action cannot be undone and will permanently remove the class and all its associated data including schedules, time slots, and locations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Class
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClassCardActions;
