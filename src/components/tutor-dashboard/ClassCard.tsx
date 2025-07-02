
import React from 'react';
import { MoreHorizontal, Edit, Trash2, Eye, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { TutorClass } from '@/hooks/use-tutor-classes';

interface ClassCardProps {
  classItem: TutorClass;
  onEdit: (classItem: TutorClass) => void;
  onManage: (classItem: TutorClass) => void;
  onDelete: (classItem: TutorClass) => void;
  onUpload?: (classItem: TutorClass) => void;
}

const ClassCard = ({ classItem, onEdit, onManage, onDelete, onUpload }: ClassCardProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Draft' },
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      running: { color: 'bg-blue-100 text-blue-800', label: 'Running' },
      completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
      inactive: { color: 'bg-red-100 text-red-800', label: 'Inactive' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge className={`${config.color} text-xs`}>
        {config.label}
      </Badge>
    );
  };

  const canEdit = classItem.status === 'draft';
  const canUpload = classItem.status === 'completed';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gradient-to-br from-primary to-primary/80">
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/20 backdrop-blur-sm hover:bg-white/30">
                <MoreHorizontal className="h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onManage(classItem)}>
                <Eye className="mr-2 h-4 w-4" />
                Manage
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => onEdit(classItem)}
                disabled={!canEdit}
                className={!canEdit ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              
              {canUpload && onUpload && (
                <DropdownMenuItem onClick={() => onUpload(classItem)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => onDelete(classItem)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between text-white">
            <div className="text-sm opacity-90">
              {classItem.delivery_mode} • {classItem.class_size}
            </div>
            {getStatusBadge(classItem.status)}
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{classItem.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {classItem.description || 'No description available'}
        </p>
        
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Students:</span>
            <span>{classItem.max_students || 'Unlimited'}</span>
          </div>
          <div className="flex justify-between">
            <span>Price:</span>
            <span>${classItem.price || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{new Date(classItem.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button 
            onClick={() => onManage(classItem)}
            className="w-full"
            size="sm"
          >
            Manage Class
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassCard;
