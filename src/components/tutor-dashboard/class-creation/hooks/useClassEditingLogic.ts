
import { useCallback } from "react";
import { useClassCreationStore } from "@/hooks/use-class-creation-store";
import { TutorClass } from "@/hooks/use-tutor-classes";

export const useClassEditingLogic = () => {
  const { 
    setDeliveryMode, 
    setClassFormat, 
    setClassSize, 
    setDurationType, 
    setBasicDetails, 
    setSchedule,
    setTimeSlots,
    setPricing,
    setLocation,
    setSyllabus
  } = useClassCreationStore();

  const loadClassData = useCallback((editingClass: TutorClass) => {
    // Set delivery and type options
    setDeliveryMode(editingClass.delivery_mode);
    setClassFormat(editingClass.class_format);
    setClassSize(editingClass.class_size);
    setDurationType(editingClass.duration_type);

    // Set basic details
    setBasicDetails({
      title: editingClass.title || '',
      subject: editingClass.subject || '',
      description: editingClass.description || '',
      thumbnailUrl: editingClass.thumbnail_url || '',
    });

    // Set schedule information
    const schedule = editingClass.class_schedules?.[0];
    setSchedule({
      frequency: schedule?.frequency as any || null,
      startDate: schedule?.start_date || null,
      endDate: schedule?.end_date || null,
      enrollmentDeadline: editingClass.enrollment_deadline || null,
      totalSessions: schedule?.total_sessions || null,
    });

    // Set time slots
    if (editingClass.class_time_slots && editingClass.class_time_slots.length > 0) {
      const timeSlots = editingClass.class_time_slots.map(slot => ({
        dayOfWeek: slot.day_of_week as any,
        startTime: slot.start_time,
        endTime: slot.end_time
      }));
      setTimeSlots(timeSlots);
    }

    // Set pricing
    setPricing({
      price: editingClass.price || null,
      currency: editingClass.currency || 'USD',
      maxStudents: editingClass.max_students || null,
      autoRenewal: editingClass.auto_renewal || false,
    });

    // Set location
    const location = editingClass.class_locations?.[0];
    setLocation({
      meetingLink: location?.meeting_link || '',
      address: {
        street: location?.street || '',
        city: location?.city || '',
        state: location?.state || '',
        zipCode: location?.zip_code || '',
        country: location?.country || '',
      },
    });

    // Set syllabus if available (this will be populated from class_syllabus table)
    setSyllabus([]);
  }, [
    setDeliveryMode,
    setClassFormat, 
    setClassSize,
    setDurationType,
    setBasicDetails,
    setSchedule,
    setTimeSlots,
    setPricing,
    setLocation,
    setSyllabus
  ]);

  return { loadClassData };
};
