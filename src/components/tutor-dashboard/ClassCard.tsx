
import React from 'react';
import { Calendar, Users, Globe, MapPin, Eye, Edit, Clock } from 'lucide-react';
import { TutorClass } from '@/hooks/use-tutor-classes';

interface ClassCardProps {
  classItem: TutorClass;
  onEdit: (classItem: TutorClass) => void;
  onManage: (classItem: TutorClass) => void;
}

const ClassCard = ({ classItem, onEdit, onManage }: ClassCardProps) => {
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
    // Check if class has schedule data
    if (classItem.class_schedules && classItem.class_schedules.length > 0) {
      const schedule = classItem.class_schedules[0];
      const startDate = schedule.start_date ? new Date(schedule.start_date) : null;
      const endDate = schedule.end_date ? new Date(schedule.end_date) : null;
      
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      };

      return {
        startDate: startDate ? formatDate(startDate) : 'Not set',
        endDate: endDate ? formatDate(endDate) : 'Not set',
        frequency: schedule.frequency || 'Not specified',
        totalSessions: schedule.total_sessions || 'Not specified',
        hasSchedule: !!(startDate || endDate)
      };
    }
    
    return {
      startDate: 'Not scheduled',
      endDate: 'Not scheduled', 
      frequency: 'Not specified',
      totalSessions: 'Not specified',
      hasSchedule: false
    };
  };

  const getClassTimeInfo = () => {
    // Check if class has time slots data
    if (classItem.class_time_slots && classItem.class_time_slots.length > 0) {
      const timeSlot = classItem.class_time_slots[0]; // Get first time slot
      const startTime = timeSlot.start_time;
      const endTime = timeSlot.end_time;
      const dayOfWeek = timeSlot.day_of_week;
      
      // Format time from "HH:MM:SS" to "HH:MM AM/PM"
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
          <div className="bg-blue-50 p-2 rounded-md">
            <div className="flex items-center text-sm text-blue-700 font-medium mb-1">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Schedule Dates</span>
            </div>
            <div className="text-xs text-blue-600 space-y-1">
              <div>Start: {scheduleInfo.startDate}</div>
              <div>End: {scheduleInfo.endDate}</div>
              {scheduleInfo.frequency && scheduleInfo.frequency !== 'Not specified' && (
                <div>Frequency: {scheduleInfo.frequency}</div>
              )}
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
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
