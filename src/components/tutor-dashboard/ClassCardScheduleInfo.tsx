
import React from 'react';
import { Calendar, Clock, Users, Repeat } from 'lucide-react';
import { TutorClass } from '@/hooks/use-tutor-classes';

interface ClassCardScheduleInfoProps {
  classItem: TutorClass;
}

const ClassCardScheduleInfo = ({ classItem }: ClassCardScheduleInfoProps) => {
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
        frequency: schedule.frequency || 'Not set',
        hasSchedule: !!startDate
      };
    }
    
    return {
      startDate: 'Not scheduled',
      frequency: 'Not set',
      hasSchedule: false
    };
  };

  const getClassTimeInfo = () => {
    if (classItem.class_time_slots && classItem.class_time_slots.length > 0) {
      const timeSlot = classItem.class_time_slots[0];
      const startTime = timeSlot.start_time;
      const endTime = timeSlot.end_time;
      
      const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const hour12 = parseInt(hours) % 12 || 12;
        const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
        return `${hour12}:${minutes} ${ampm}`;
      };

      return {
        timeRange: `${formatTime(startTime)} - ${formatTime(endTime)}`
      };
    }
    
    return {
      timeRange: 'Time not set'
    };
  };

  const scheduleInfo = getScheduleInfo();
  const timeInfo = getClassTimeInfo();

  const getFrequencyDisplay = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'biweekly':
        return 'Bi-weekly';
      case 'monthly':
        return 'Monthly';
      default:
        return frequency || 'Not set';
    }
  };

  return (
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
        <Repeat className="h-4 w-4 mr-2" />
        <span>{getFrequencyDisplay(scheduleInfo.frequency)}</span>
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
  );
};

export default ClassCardScheduleInfo;
