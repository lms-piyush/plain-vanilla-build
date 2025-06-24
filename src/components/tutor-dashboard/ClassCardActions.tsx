
import React from 'react';
import { Settings, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TutorClass } from '@/hooks/use-tutor-classes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ClassCardActionsProps {
  classItem: TutorClass;
  onEdit?: (classItem: TutorClass) => void;
  onDelete?: (id: string, title: string) => void;
}

const ClassCardActions = ({ classItem, onEdit, onDelete }: ClassCardActionsProps) => {
  const { toast } = useToast();

  const handleEdit = () => {
    if (onEdit) {
      onEdit(classItem);
    } else {
      toast({
        title: "Edit functionality",
        description: "Edit modal would open here",
      });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(classItem.id, classItem.title);
    } else {
      toast({
        title: "Confirm deletion",
        description: `Are you sure you want to delete "${classItem.title}"?`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Link 
        to={`/tutor-dashboard/classes/${classItem.id}`}
        className="flex-1 bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors flex items-center justify-center"
      >
        <Settings className="h-4 w-4 mr-1" />
        Manage Class
      </Link>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="px-2">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleDelete}
            className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ClassCardActions;
