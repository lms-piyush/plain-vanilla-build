
import React from 'react';
import { Plus, ArrowRight, Calendar, Users } from 'lucide-react';
import { TutorClass } from '@/hooks/use-tutor-classes';
import ClassesPagination from './ClassesPagination';

interface SessionsSectionProps {
  sessionFilter: 'today' | 'all';
  onFilterChange: (filter: 'today' | 'all') => void;
  filteredClasses: TutorClass[];
  todaysSessionsCount: number;
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  paginationInfo: {
    totalFilteredCount: number;
    totalFilteredPages: number;
    shouldShowPagination: boolean;
  };
  onCreateClass: () => void;
}

const SessionsSection = ({
  sessionFilter,
  onFilterChange,
  filteredClasses,
  todaysSessionsCount,
  totalCount,
  currentPage,
  onPageChange,
  paginationInfo,
  onCreateClass
}: SessionsSectionProps) => {
  const formatClassTimeInfo = (classItem: any) => {
    // Schedule information
    let scheduleInfo = 'Not scheduled';
    if (classItem.class_schedules && classItem.class_schedules.length > 0) {
      const schedule = classItem.class_schedules[0];
      const startDate = schedule.start_date ? new Date(schedule.start_date).toLocaleDateString() : null;
      
      if (sessionFilter === 'today') {
        scheduleInfo = startDate ? `Scheduled: ${startDate}` : 'Not scheduled';
      } else {
        scheduleInfo = startDate ? `Starts: ${startDate}` : 'Not scheduled';
      }
    }

    // Time slot information  
    let timeInfo = 'Time not set';
    if (classItem.class_time_slots && classItem.class_time_slots.length > 0) {
      const timeSlot = classItem.class_time_slots[0];
      const startTime = timeSlot.start_time;
      const endTime = timeSlot.end_time;
      
      // Format time from "HH:MM:SS" to "HH:MM AM/PM"
      const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const hour12 = parseInt(hours) % 12 || 12;
        const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
        return `${hour12}:${minutes} ${ampm}`;
      };

      timeInfo = `${formatTime(startTime)} - ${formatTime(endTime)}`;
    }

    return {
      date: scheduleInfo,
      time: timeInfo
    };
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Sessions</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => onFilterChange('today')}
            className={`text-sm px-4 py-2 rounded-md transition-colors ${
              sessionFilter === 'today' 
                ? 'bg-primary text-white' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Today's Sessions ({todaysSessionsCount})
          </button>
          <button 
            onClick={() => onFilterChange('all')}
            className={`text-sm px-4 py-2 rounded-md transition-colors ${
              sessionFilter === 'all' 
                ? 'bg-primary text-white' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            All Sessions ({totalCount})
          </button>
        </div>
      </div>
      
      <div className="flex justify-between flex-wrap">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          {filteredClasses.length > 0 ? (
            filteredClasses.map(classItem => {
              const timeInfo = formatClassTimeInfo(classItem);
              return (
                <div key={classItem.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-medium text-gray-800">{classItem.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{classItem.description || "No description available"}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar size={16} className="mr-2 text-gray-500" />
                      <span>{timeInfo.date}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Calendar size={16} className="mr-2 text-gray-500" />
                      <span>{timeInfo.time}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users size={16} className="mr-2 text-gray-500" />
                      <span>{classItem.class_size === 'one-on-one' ? '1 student' : (classItem.max_students ? `Max ${classItem.max_students} students` : 'No limit')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-5 flex items-center justify-between">
                    <button className="bg-primary text-white px-4 py-2 rounded-md text-sm">
                      Start Session
                    </button>
                    <button className="p-2 rounded-md hover:bg-gray-100">
                      <ArrowRight size={18} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-500">
                {sessionFilter === 'today' 
                  ? 'No classes scheduled for today' 
                  : 'No classes found'}
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-6 w-full lg:mt-0 lg:w-auto lg:ml-6 flex justify-center">
          <button 
            onClick={onCreateClass}
            className="inline-flex items-center justify-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Create new Class
          </button>
        </div>
      </div>

      {/* Pagination - Now shows for both Today's Sessions and All Sessions when needed */}
      {paginationInfo.shouldShowPagination && (
        <div className="mt-6">
          <ClassesPagination
            currentPage={currentPage}
            totalPages={paginationInfo.totalFilteredPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default SessionsSection;
