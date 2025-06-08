
import React from 'react';
import { Calendar, Users, Plus, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { TutorClass } from '@/hooks/use-tutor-classes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ClassesGridProps {
  classes: TutorClass[];
  onEditClass: (classItem: TutorClass) => void;
  onManageClass: (classItem: TutorClass) => void;
  onCreateClass: () => void;
  onDeleteClass?: (classItem: TutorClass) => void;
}

const ClassesGrid = ({ 
  classes, 
  onEditClass, 
  onManageClass, 
  onCreateClass,
  onDeleteClass 
}: ClassesGridProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (classes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="mb-4">
          <Calendar size={48} className="mx-auto text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-800">No classes found</h3>
          <p className="text-gray-500">Get started by creating your first class</p>
        </div>
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
        <div key={classItem.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(classItem.status)}`}>
              {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded-md hover:bg-gray-100">
                  <MoreHorizontal size={16} className="text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onManageClass(classItem)}>
                  <Eye size={16} className="mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditClass(classItem)}>
                  <Edit size={16} className="mr-2" />
                  Edit Class
                </DropdownMenuItem>
                {onDeleteClass && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDeleteClass(classItem)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete Class
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{classItem.title}</h3>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{classItem.description || "No description available"}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm">
              <Calendar size={16} className="mr-2 text-gray-500" />
              <span>Created {new Date(classItem.created_at).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Users size={16} className="mr-2 text-gray-500" />
              <span>{classItem.class_size === 'one-on-one' ? '1-on-1' : 'Group'}</span>
            </div>
            
            {classItem.max_students && (
              <div className="flex items-center text-sm">
                <Users size={16} className="mr-2 text-gray-500" />
                <span>Max {classItem.max_students} students</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => onManageClass(classItem)}
              className="flex-1 bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors"
            >
              Manage Class
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassesGrid;
