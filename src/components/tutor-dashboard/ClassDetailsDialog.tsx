
import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Users, Calendar, Clock, DollarSign, BookOpen, FileText, Link as LinkIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TutorClass } from '@/hooks/use-tutor-classes';
import { supabase } from '@/integrations/supabase/client';

interface ClassDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClass: TutorClass | null;
}

interface ClassSyllabus {
  id: string;
  title: string;
  description: string;
  week_number: number;
}

interface LessonMaterial {
  id: string;
  material_name: string;
  material_type: string;
  material_url: string;
  display_order: number;
  lesson_id: string;
}

const ClassDetailsDialog = ({ open, onOpenChange, selectedClass }: ClassDetailsDialogProps) => {
  const [syllabus, setSyllabus] = useState<ClassSyllabus[]>([]);
  const [materials, setMaterials] = useState<LessonMaterial[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!selectedClass || !open) return;
      
      setLoading(true);
      try {
        // Fetch syllabus
        const { data: syllabusData } = await supabase
          .from('class_syllabus')
          .select('*')
          .eq('class_id', selectedClass.id)
          .order('week_number');

        if (syllabusData) {
          setSyllabus(syllabusData);

          // Fetch materials for all lessons
          const { data: materialsData } = await supabase
            .from('lesson_materials')
            .select('*')
            .in('lesson_id', syllabusData.map(s => s.id))
            .order('display_order');

          if (materialsData) {
            setMaterials(materialsData);
          }
        }
      } catch (error) {
        console.error('Error fetching class details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [selectedClass, open]);

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
      <Badge className={statusStyles[status as keyof typeof statusStyles] || statusStyles.inactive}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
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
        endDate: schedule.end_date ? formatDate(new Date(schedule.end_date)) : 'Not set',
        frequency: schedule.frequency || 'Not specified',
        totalSessions: schedule.total_sessions || 'Not specified',
        hasSchedule: !!startDate
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
          dayOfWeek: slot.day_of_week.charAt(0).toUpperCase() + slot.day_of_week.slice(1),
          timeRange: `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`
        };
      });
    }
    
    return [];
  };

  const formatPrice = () => {
    if (!selectedClass?.price || selectedClass.price === 0) return 'Free';
    const currencySymbol = selectedClass.currency === 'USD' ? '$' : selectedClass.currency;
    const renewal = selectedClass.auto_renewal ? ' (Auto-renewal)' : '';
    return `${currencySymbol}${selectedClass.price}${renewal}`;
  };

  const scheduleInfo = getScheduleInfo();
  const timeSlots = getTimeSlotInfo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Complete Class Overview
          </DialogTitle>
        </DialogHeader>
        
        {selectedClass && (
          <div className="space-y-6">
            {/* Class Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{selectedClass.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusBadge(selectedClass.status)}
                      <Badge variant="outline">
                        {selectedClass.subject || 'No subject'}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{selectedClass.description || "No description provided"}</p>
                  </div>
                  {selectedClass.thumbnail_url && (
                    <img 
                      src={selectedClass.thumbnail_url} 
                      alt="Class thumbnail" 
                      className="w-24 h-16 object-cover rounded-lg ml-4"
                    />
                  )}
                </div>
              </CardHeader>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column - Schedule & Format */}
              <div className="space-y-4">
                {/* Class Format & Delivery */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      {getDeliveryIcon(selectedClass.delivery_mode)}
                      Class Format
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Delivery:</span>
                        <p className="capitalize">{selectedClass.delivery_mode}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Format:</span>
                        <p className="capitalize">{selectedClass.class_format}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Size:</span>
                        <p className="capitalize">{selectedClass.class_size.replace('-', ' ')}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <p className="capitalize">{selectedClass.duration_type}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {scheduleInfo && (
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Start Date:</span>
                          <p>{scheduleInfo.startDate}</p>
                        </div>
                        {scheduleInfo.endDate !== 'Not set' && (
                          <div>
                            <span className="font-medium text-gray-700">End Date:</span>
                            <p>{scheduleInfo.endDate}</p>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-700">Frequency:</span>
                          <p className="capitalize">{scheduleInfo.frequency}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Total Sessions:</span>
                          <p>{scheduleInfo.totalSessions}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Time Slots */}
                {timeSlots && timeSlots.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Weekly Time Slots
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {timeSlots.map((slot, index) => (
                          <div key={slot.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="font-medium text-sm">{slot.dayOfWeek}</span>
                            <span className="text-sm text-gray-600">{slot.timeRange}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column - Pricing & Location */}
              <div className="space-y-4">
                {/* Pricing & Capacity */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Pricing & Capacity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm space-y-2">
                      <div>
                        <span className="font-medium text-gray-700">Price:</span>
                        <p className="text-lg font-semibold text-green-600">{formatPrice()}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Capacity:</span>
                        <p>{getStudentLimit(selectedClass.class_size, selectedClass.max_students)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Currency:</span>
                        <p>{selectedClass.currency || 'USD'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location/Connection Details */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      {selectedClass.delivery_mode === 'online' ? 
                        <LinkIcon className="h-4 w-4" /> : 
                        <MapPin className="h-4 w-4" />
                      }
                      {selectedClass.delivery_mode === 'online' ? 'Meeting Details' : 'Location Details'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedClass.class_locations && selectedClass.class_locations.length > 0 ? (
                      selectedClass.class_locations.map((location, index) => (
                        <div key={index} className="text-sm space-y-2">
                          {location.meeting_link && (
                            <div>
                              <span className="font-medium text-gray-700">Meeting Link:</span>
                              <p className="text-blue-600 break-all">{location.meeting_link}</p>
                            </div>
                          )}
                          {(location.street || location.city || location.state) && (
                            <div>
                              <span className="font-medium text-gray-700">Address:</span>
                              <p>{[location.street, location.city, location.state, location.zip_code, location.country].filter(Boolean).join(', ')}</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No location details available</p>
                    )}
                  </CardContent>
                </Card>

                {/* Class Metadata */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Class Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Created:</span>
                      <p>{new Date(selectedClass.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Last Updated:</span>
                      <p>{new Date(selectedClass.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Curriculum Section */}
            {syllabus.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Course Curriculum ({syllabus.length} lessons)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {syllabus.map((lesson, index) => {
                      const lessonMaterials = materials.filter(m => m.lesson_id === lesson.id);
                      return (
                        <div key={lesson.id} className="border-l-2 border-blue-200 pl-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">Week {lesson.week_number}</Badge>
                            <h4 className="font-medium">{lesson.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                          {lessonMaterials.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-gray-700 mb-1">Materials:</p>
                              <div className="space-y-1">
                                {lessonMaterials.map(material => (
                                  <div key={material.id} className="text-xs text-gray-600 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                    {material.material_name} ({material.material_type})
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClassDetailsDialog;
