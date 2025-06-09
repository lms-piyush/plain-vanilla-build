import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { TutorClass } from '@/hooks/use-tutor-classes';
import BasicInfoForm from './class-creation/BasicInfoForm';
import ClassConfigForm from './class-creation/ClassConfigForm';
import ScheduleForm from './class-creation/ScheduleForm';

interface SimpleCreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClassCreated: () => void;
  editingClass?: TutorClass | null;
}

const SimpleCreateClassDialog = ({ 
  open, 
  onOpenChange, 
  onClassCreated, 
  editingClass 
}: SimpleCreateClassDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<'online' | 'offline'>('online');
  const [classFormat, setClassFormat] = useState<'live' | 'recorded' | 'inbound' | 'outbound'>('live');
  const [classSize, setClassSize] = useState<'group' | 'one-on-one'>('group');
  const [durationType, setDurationType] = useState<'recurring' | 'fixed'>('fixed');
  const [status, setStatus] = useState<'draft' | 'active' | 'inactive' | 'completed'>('draft');
  const [price, setPrice] = useState('');
  const [maxStudents, setMaxStudents] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  
  // Schedule fields
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingSchedule, setExistingSchedule] = useState<any>(null);

  // Fetch existing schedule when editing
  useEffect(() => {
    const fetchExistingSchedule = async () => {
      if (editingClass && open) {
        try {
          // Fetch existing schedule
          const { data: scheduleData } = await supabase
            .from('class_schedules')
            .select('*')
            .eq('class_id', editingClass.id)
            .single();

          if (scheduleData) {
            setExistingSchedule(scheduleData);
            setStartDate(scheduleData.start_date || '');
          }

          // Fetch existing time slot
          const { data: timeSlotData } = await supabase
            .from('class_time_slots')
            .select('*')
            .eq('class_id', editingClass.id)
            .single();

          if (timeSlotData) {
            setStartTime(timeSlotData.start_time || '09:00');
            setEndTime(timeSlotData.end_time || '10:00');
          }

          // Fetch existing meeting link
          if (editingClass.delivery_mode === 'online') {
            const { data: locationData } = await supabase
              .from('class_locations')
              .select('meeting_link')
              .eq('class_id', editingClass.id)
              .single();

            if (locationData) {
              setMeetingLink(locationData.meeting_link || '');
            }
          }
        } catch (error) {
          console.error('Error fetching existing schedule:', error);
        }
      }
    };

    fetchExistingSchedule();
  }, [editingClass, open]);

  // Reset form when dialog opens/closes or when editing class changes
  useEffect(() => {
    if (editingClass) {
      setTitle(editingClass.title || '');
      setDescription(editingClass.description || '');
      setSubject(editingClass.subject || '');
      setDeliveryMode(editingClass.delivery_mode);
      setClassFormat(editingClass.class_format);
      setClassSize(editingClass.class_size);
      setDurationType(editingClass.duration_type);
      setStatus(editingClass.status);
      setPrice(editingClass.price?.toString() || '');
      setMaxStudents(editingClass.max_students?.toString() || '');
    } else {
      // Reset form for new class
      setTitle('');
      setDescription('');
      setSubject('');
      setDeliveryMode('online');
      setClassFormat('live');
      setClassSize('group');
      setDurationType('fixed');
      setStatus('draft');
      setPrice('');
      setMaxStudents('');
      setMeetingLink('');
      setStartDate('');
      setStartTime('09:00');
      setEndTime('10:00');
      setExistingSchedule(null);
    }
  }, [editingClass, open]);

  // Auto-set max students when class size changes
  useEffect(() => {
    if (classSize === 'one-on-one') {
      setMaxStudents('1');
    }
  }, [classSize]);

  // Function to get day of week from date
  const getDayOfWeekFromDate = (dateString: string) => {
    if (!dateString) return 'monday';
    const date = new Date(dateString);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a class title');
      return;
    }

    if (!startDate) {
      toast.error('Please select a start date');
      return;
    }

    if (!startTime || !endTime) {
      toast.error('Please set start and end times');
      return;
    }

    setIsSubmitting(true);

    try {
      const classData = {
        title: title.trim(),
        description: description.trim() || null,
        subject: subject.trim() || null,
        delivery_mode: deliveryMode,
        class_format: classFormat,
        class_size: classSize,
        duration_type: durationType,
        status: status,
        price: price ? parseFloat(price) : null,
        max_students: maxStudents ? parseInt(maxStudents) : null,
        currency: 'USD'
      };

      let classId: string;

      if (editingClass) {
        // Update existing class
        const { error } = await supabase
          .from('classes')
          .update({
            ...classData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingClass.id);

        if (error) throw error;
        classId = editingClass.id;
        toast.success('Class updated successfully!');
      } else {
        // Create new class
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error('You must be logged in to create a class');
          return;
        }

        const { data: newClass, error } = await supabase
          .from('classes')
          .insert({
            ...classData,
            tutor_id: user.id
          })
          .select('id')
          .single();

        if (error) throw error;
        classId = newClass.id;
        toast.success('Class created successfully!');
      }

      // Handle schedule data - always update/insert single schedule
      if (startDate && startTime && endTime) {
        // Update or insert class schedule
        const scheduleData = {
          class_id: classId,
          start_date: startDate,
          frequency: 'weekly' // Default frequency
        };

        if (existingSchedule) {
          await supabase
            .from('class_schedules')
            .update(scheduleData)
            .eq('class_id', classId);
        } else {
          await supabase
            .from('class_schedules')
            .insert(scheduleData);
        }

        // Auto-populate day of week from the selected date
        const dayOfWeek = getDayOfWeekFromDate(startDate);

        // Update or insert time slot
        const timeSlotData = {
          class_id: classId,
          day_of_week: dayOfWeek,
          start_time: startTime,
          end_time: endTime
        };

        const { data: existingTimeSlot } = await supabase
          .from('class_time_slots')
          .select('id')
          .eq('class_id', classId)
          .single();

        if (existingTimeSlot) {
          await supabase
            .from('class_time_slots')
            .update(timeSlotData)
            .eq('class_id', classId);
        } else {
          await supabase
            .from('class_time_slots')
            .insert(timeSlotData);
        }
      }

      // Handle meeting link for online classes
      if (deliveryMode === 'online' && meetingLink.trim()) {
        const locationData = {
          class_id: classId,
          meeting_link: meetingLink.trim()
        };

        const { data: existingLocation } = await supabase
          .from('class_locations')
          .select('id')
          .eq('class_id', classId)
          .single();

        if (existingLocation) {
          await supabase
            .from('class_locations')
            .update(locationData)
            .eq('class_id', classId);
        } else {
          await supabase
            .from('class_locations')
            .insert(locationData);
        }
      }

      onClassCreated();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving class:', error);
      toast.error(`Failed to ${editingClass ? 'update' : 'create'} class: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingClass ? 'Edit Class' : 'Create New Class'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <BasicInfoForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            subject={subject}
            setSubject={setSubject}
            status={status}
            setStatus={setStatus}
            price={price}
            setPrice={setPrice}
            maxStudents={maxStudents}
            setMaxStudents={setMaxStudents}
            classSize={classSize}
          />

          <ClassConfigForm
            deliveryMode={deliveryMode}
            setDeliveryMode={setDeliveryMode}
            meetingLink={meetingLink}
            setMeetingLink={setMeetingLink}
            classFormat={classFormat}
            setClassFormat={setClassFormat}
            classSize={classSize}
            setClassSize={setClassSize}
            durationType={durationType}
            setDurationType={setDurationType}
          />

          <ScheduleForm
            startDate={startDate}
            setStartDate={setStartDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (editingClass ? 'Updating...' : 'Creating...') 
                : (editingClass ? 'Update Class' : 'Create Class')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleCreateClassDialog;
