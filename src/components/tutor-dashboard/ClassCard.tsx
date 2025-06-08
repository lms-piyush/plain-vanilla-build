
import React, { useState } from 'react';
import { Calendar, Users, Globe, MapPin, Eye, Edit, Clock, Trash2 } from 'lucide-react';
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

interface ClassCardProps {
  classItem: TutorClass;
  onEdit: (classItem: TutorClass) => void;
  onManage: (classItem: TutorClass) => void;
  onDelete: (classItem: TutorClass) => void;
}

const ClassCard = ({ classItem, onEdit, onManage, onDelete }: ClassCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getDeliveryIcon = (deliveryMode: string) => {
    return deliveryMode === 'online' ? (
      <Globe className="h-4 w-4 text-blue-600" />
    ) : (
      <MapPin className="h-4 w-4 text-green-600" />
    );
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      inactive: "bg-gray-100 text-gray-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.inactive}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStudentLimit = (classSize: string, maxStudents: number | null) => {
    if (classSize === 'one-on-one') {
      return '1 student';
    }
    return maxStudents ? `Max ${maxStudents} students` : 'No limit';
  };

  const getScheduleInfo = () => {
    if (classItem.class_schedules && classItem.class_schedules.length > 0) {
      const schedule = classItem.class_schedules[0];
      const startDate = schedule.start_date ? new Date(schedule.start_date) : null;
      
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      };

      return {
        startDate: startDate ? formatDate(startDate) : 'Not set',
        hasSchedule: !!startDate
      };
    }
    
    return {
      startDate: 'Not scheduled',
      hasSchedule: false
    };
  };

  const getClassTimeInfo = () => {
    if (classItem.class_time_slots && classItem.class_time_slots.length > 0) {
      const timeSlot = classItem.class_time_slots[0];
      const startTime = timeSlot.start_time;
      const endTime = timeSlot.end_time;
      const dayOfWeek = timeSlot.day_of_week;
      
      const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const hour12 = parseInt(hours) % 12 || 12;
        const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
        return `${hour12}:${minutes} ${ampm}`;
      };

      return {
        dayOfWeek,
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        timeRange: `${formatTime(startTime)} - ${formatTime(endTime)}`
      };
    }
    
    return {
      dayOfWeek: 'Not scheduled',
      startTime: 'N/A',
      endTime: 'N/A',
      timeRange: 'Time not set'
    };
  };

  const handleDeleteConfirm = () => {
    onDelete(classItem);
    setShowDeleteDialog(false);
  };

  const scheduleInfo = getScheduleInfo();
  const timeInfo = getClassTimeInfo();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-32 bg-gradient-to-br from-primary to-purple-600">
        <div className="absolute top-3 right-3">
          {getStatusBadge(classItem.status)}
        </div>
        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-center text-sm">
            {getDeliveryIcon(classItem.delivery_mode)}
            <span className="ml-2 capitalize">{classItem.delivery_mode} • {classItem.class_size}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">{classItem.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{classItem.description || "No description available"}</p>
        
        <div className="space-y-2 mb-4">
          {/* Schedule Date Section */}
          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex items-center text-sm text-blue-700 font-medium mb-1">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Schedule Date</span>
            </div>
            <div className="text-sm text-blue-600">
              {scheduleInfo.startDate}
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{timeInfo.dayOfWeek}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>{timeInfo.timeRange}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2" />
            <span>{getStudentLimit(classItem.class_size, classItem.max_students)}</span>
          </div>
        </div>
        
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
      </div>
    </div>
  );
};

export default ClassCard;
