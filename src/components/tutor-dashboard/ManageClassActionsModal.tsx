
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TutorClass } from '@/hooks/use-tutor-classes';

interface ManageClassActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: TutorClass | null;
  onEdit: (classItem: TutorClass) => void;
  onDelete: (classItem: TutorClass) => void;
}

const ManageClassActionsModal = ({ isOpen, onClose, classData, onEdit, onDelete }: ManageClassActionsModalProps) => {
  if (!classData) return null;

  const handleEdit = () => {
    onEdit(classData);
    onClose();
  };

  const handleDelete = () => {
    onDelete(classData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Class</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Class
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Class
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageClassActionsModal;
