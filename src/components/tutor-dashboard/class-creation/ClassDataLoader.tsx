
import { useToast } from "@/hooks/use-toast";
import { useClassCreationStore, DayOfWeek } from "@/hooks/use-class-creation-store";
import { TutorClass } from "@/hooks/use-tutor-classes";
import { supabase } from "@/integrations/supabase/client";

export const useClassDataLoader = () => {
  const { toast } = useToast();
  const { 
    setDeliveryMode, 
    setClassFormat, 
    setClassSize, 
    setDurationType, 
    setBasicDetails, 
    setSchedule, 
    setPricing, 
    setTimeSlots, 
    setLocation, 
    setSyllabus, 
    addMaterial 
  } = useClassCreationStore();

  const loadClassData = async (editingClass: TutorClass) => {
    console.log('Loading existing class data:', editingClass);
    
    // Set basic class details
    setDeliveryMode(editingClass.delivery_mode);
    setClassFormat(editingClass.class_format);
    setClassSize(editingClass.class_size);
    setDurationType(editingClass.duration_type);
    
    setBasicDetails({
      title: editingClass.title || '',
      subject: editingClass.subject || '',
      description: editingClass.description || '',
      thumbnailUrl: editingClass.thumbnail_url || ''
    });
    
    setPricing({
      price: editingClass.price || null,
      currency: editingClass.currency || 'USD',
      maxStudents: editingClass.max_students || null,
      autoRenewal: editingClass.auto_renewal || false
    });

    try {
      // Load schedule data
      const { data: scheduleData } = await supabase
        .from('class_schedules')
        .select('*')
        .eq('class_id', editingClass.id)
        .maybeSingle();

      if (scheduleData) {
        setSchedule({
          frequency: scheduleData.frequency as any,
          startDate: scheduleData.start_date,
          endDate: scheduleData.end_date,
          totalSessions: scheduleData.total_sessions
        });
      }

      // Load time slots data
      const { data: timeSlotsData } = await supabase
        .from('class_time_slots')
        .select('*')
        .eq('class_id', editingClass.id)
        .order('day_of_week');

      if (timeSlotsData && timeSlotsData.length > 0) {
        const timeSlots = timeSlotsData.map(slot => ({
          dayOfWeek: slot.day_of_week as DayOfWeek,
          startTime: slot.start_time,
          endTime: slot.end_time
        }));
        setTimeSlots(timeSlots);
      }

      // Load location data
      const { data: locationData } = await supabase
        .from('class_locations')
        .select('*')
        .eq('class_id', editingClass.id)
        .maybeSingle();

      if (locationData) {
        setLocation({
          meetingLink: locationData.meeting_link || '',
          address: {
            street: locationData.street || '',
            city: locationData.city || '',
            state: locationData.state || '',
            zipCode: locationData.zip_code || '',
            country: locationData.country || ''
          }
        });
      }

      // Load syllabus data
      const { data: syllabusData } = await supabase
        .from('class_syllabus')
        .select('*')
        .eq('class_id', editingClass.id)
        .order('week_number');

      if (syllabusData && syllabusData.length > 0) {
        const syllabus = syllabusData.map(item => ({
          title: item.title,
          description: item.description || ''
        }));
        setSyllabus(syllabus);

        // Load materials for each lesson
        for (const lesson of syllabusData) {
          const { data: materialsData } = await supabase
            .from('lesson_materials')
            .select('*')
            .eq('lesson_id', lesson.id)
            .order('display_order');

          if (materialsData && materialsData.length > 0) {
            materialsData.forEach(material => {
              addMaterial({
                name: material.material_name,
                type: material.material_type,
                url: material.material_url,
                lessonIndex: lesson.week_number - 1
              });
            });
          }
        }
      }
    } catch (error) {
      console.error('Error loading class data:', error);
      toast({
        title: "Error loading class data",
        description: "Some class details may not be loaded correctly.",
        variant: "destructive"
      });
    }
  };

  return { loadClassData };
};

// Export as component for compatibility
const ClassDataLoader = () => null;
export default ClassDataLoader;
