import React from 'react';
import { Globe, MapPin, Users, Calendar, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TutorClass } from '@/hooks/use-tutor-classes';

interface ClassDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClass: TutorClass | null;
}

const ClassDetailsDialog = ({ open, onOpenChange, selectedClass }: ClassDetailsDialogProps) => {
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
    if (!selectedClass) return null;
    
    if (selectedClass.class_schedules && selectedClass.class_schedules.length > 0) {
      const schedule = selectedClass.class_schedules[0];
      const startDate = schedule.start_date ? new Date(schedule.start_date) : null;
      
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };

      return {
        startDate: startDate ? formatDate(startDate) : 'Not set',
        totalSessions: schedule.total_sessions || 'Not specified',
        hasSchedule: !!startDate
      };
    }
    
    return {
      startDate: 'Not scheduled',
      totalSessions: 'Not specified',
      hasSchedule: false
    };
  };

  const getTimeSlotInfo = () => {
    if (!selectedClass) return null;
    
    if (selectedClass.class_time_slots && selectedClass.class_time_slots.length > 0) {
      return selectedClass.class_time_slots.map((slot, index) => {
        const formatTime = (timeStr: string) => {
          const [hours, minutes] = timeStr.split(':');
          const hour12 = parseInt(hours) % 12 || 12;
          const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
          return `${hour12}:${minutes} ${ampm}`;
        };

        return {
          id: slot.id,
          dayOfWeek: slot.day_of_week,
          timeRange: `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`
        };
      });
    }
    
    return [];
  };

  const scheduleInfo = getScheduleInfo();
  const timeSlots = getTimeSlotInfo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">Class Details</DialogTitle>
        </DialogHeader>
        
        {selectedClass && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">{selectedClass.title}</h3>
              <p className="text-gray-600">{selectedClass.description || "No description available"}</p>
            </div>
            
            {/* Schedule Information Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Information
              </h4>
              {scheduleInfo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-blue-700">Start Date:</span>
                      <p className="text-sm text-blue-900">{scheduleInfo.startDate}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-blue-700">Total Sessions:</span>
                      <p className="text-sm text-blue-900">{scheduleInfo.totalSessions}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Time Slots Section */}
            {timeSlots && timeSlots.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Time Slots
                </h4>
                <div className="space-y-2">
                  {timeSlots.map((slot, index) => (
                    <div key={slot.id} className="flex items-center justify-between bg-white p-2 rounded border border-green-100">
                      <span className="font-medium text-green-700">{slot.dayOfWeek}</span>
                      <span className="text-green-600">{slot.timeRange}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Class Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    {getDeliveryIcon(selectedClass.delivery_mode)}
                    <span className="ml-2 capitalize">{selectedClass.delivery_mode}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{getStudentLimit(selectedClass.class_size, selectedClass.max_students)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500">Status:</span>
                    <span className="ml-2">{getStatusBadge(selectedClass.status)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Additional Details</h4>
                <div className="space-y-2 text-sm">
                  {selectedClass.subject && (
                    <div>
                      <span className="text-gray-500">Subject:</span>
                      <span className="ml-2">{selectedClass.subject}</span>
                    </div>
                  )}
                  {selectedClass.price && (
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <span className="ml-2">{selectedClass.currency || 'USD'} {selectedClass.price}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-2">{new Date(selectedClass.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {selectedClass.class_locations && selectedClass.class_locations.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Location Details</h4>
                {selectedClass.class_locations.map((location, index) => (
                  <div key={index} className="text-sm space-y-1">
                    {location.meeting_link && (
                      <div>
                        <span className="text-gray-500">Meeting Link:</span>
                        <span className="ml-2 text-blue-600">{location.meeting_link}</span>
                      </div>
                    )}
                    {(location.street || location.city || location.state) && (
                      <div>
                        <span className="text-gray-500">Address:</span>
                        <span className="ml-2">
                          {[location.street, location.city, location.state, location.zip_code].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClassDetailsDialog;
