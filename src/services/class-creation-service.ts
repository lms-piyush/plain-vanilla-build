
import { supabase } from '@/integrations/supabase/client';
import { FormState } from '@/hooks/use-class-creation-store';

export const saveClass = async (formState: FormState, status: 'draft' | 'active', editingClassId?: string) => {
  const { user } = await supabase.auth.getUser();
  if (!user.user) {
    throw new Error('User not authenticated');
  }

  try {
    let classData;
    
    if (editingClassId) {
      // Update existing class
      const { data, error } = await supabase
        .from('classes')
        .update({
          title: formState.basicDetails.title,
          description: formState.basicDetails.description,
          subject: formState.basicDetails.subject,
          delivery_mode: formState.deliveryMode,
          class_format: formState.classFormat,
          class_size: formState.classSize,
          duration_type: formState.durationType,
          status,
          price: formState.pricing.price,
          currency: formState.pricing.currency,
          max_students: formState.pricing.maxStudents,
          auto_renewal: formState.pricing.autoRenewal,
          thumbnail_url: formState.basicDetails.thumbnailUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingClassId)
        .select()
        .single();

      if (error) throw error;
      classData = data;
    } else {
      // Create new class
      const { data, error } = await supabase
        .from('classes')
        .insert({
          title: formState.basicDetails.title,
          description: formState.basicDetails.description,
          subject: formState.basicDetails.subject,
          delivery_mode: formState.deliveryMode,
          class_format: formState.classFormat,
          class_size: formState.classSize,
          duration_type: formState.durationType,
          status,
          price: formState.pricing.price,
          currency: formState.pricing.currency,
          max_students: formState.pricing.maxStudents,
          auto_renewal: formState.pricing.autoRenewal,
          thumbnail_url: formState.basicDetails.thumbnailUrl,
          tutor_id: user.user.id
        })
        .select()
        .single();

      if (error) throw error;
      classData = data;
    }

    const classId = classData.id;

    // Handle schedule data
    if (formState.schedule.frequency) {
      if (editingClassId) {
        // Delete existing schedule
        await supabase
          .from('class_schedules')
          .delete()
          .eq('class_id', classId);
      }

      // Insert new schedule
      await supabase
        .from('class_schedules')
        .insert({
          class_id: classId,
          start_date: formState.schedule.startDate,
          end_date: formState.schedule.endDate,
          frequency: formState.schedule.frequency,
          total_sessions: formState.schedule.totalSessions
        });
    }

    // Handle time slots
    if (formState.timeSlots.length > 0) {
      if (editingClassId) {
        // Delete existing time slots
        await supabase
          .from('class_time_slots')
          .delete()
          .eq('class_id', classId);
      }

      // Insert new time slots
      const timeSlotData = formState.timeSlots.map(slot => ({
        class_id: classId,
        day_of_week: slot.dayOfWeek,
        start_time: slot.startTime,
        end_time: slot.endTime
      }));

      await supabase
        .from('class_time_slots')
        .insert(timeSlotData);
    }

    // Handle location data
    if (formState.location.meetingLink || 
        formState.location.address.street || 
        formState.location.address.city) {
      
      if (editingClassId) {
        // Delete existing location
        await supabase
          .from('class_locations')
          .delete()
          .eq('class_id', classId);
      }

      // Insert new location
      await supabase
        .from('class_locations')
        .insert({
          class_id: classId,
          meeting_link: formState.location.meetingLink,
          street: formState.location.address.street,
          city: formState.location.address.city,
          state: formState.location.address.state,
          zip_code: formState.location.address.zipCode,
          country: formState.location.address.country
        });
    }

    // Handle syllabus
    if (formState.syllabus.length > 0) {
      if (editingClassId) {
        // Delete existing syllabus and materials
        const { data: existingLessons } = await supabase
          .from('class_syllabus')
          .select('id')
          .eq('class_id', classId);

        if (existingLessons && existingLessons.length > 0) {
          const lessonIds = existingLessons.map(lesson => lesson.id);
          
          // Delete lesson materials first
          await supabase
            .from('lesson_materials')
            .delete()
            .in('lesson_id', lessonIds);
        }

        // Delete syllabus
        await supabase
          .from('class_syllabus')
          .delete()
          .eq('class_id', classId);
      }

      // Insert new syllabus
      const syllabusData = formState.syllabus.map((lesson, index) => ({
        class_id: classId,
        week_number: index + 1,
        title: lesson.title,
        description: lesson.description
      }));

      const { data: insertedLessons } = await supabase
        .from('class_syllabus')
        .insert(syllabusData)
        .select();

      // Handle materials for each lesson
      if (insertedLessons && formState.materials.length > 0) {
        const materialsData: any[] = [];
        
        formState.materials.forEach(material => {
          const lessonId = insertedLessons[material.lessonIndex]?.id;
          if (lessonId) {
            materialsData.push({
              lesson_id: lessonId,
              material_name: material.name,
              material_type: material.type,
              material_url: material.url,
              display_order: 0
            });
          }
        });

        if (materialsData.length > 0) {
          await supabase
            .from('lesson_materials')
            .insert(materialsData);
        }
      }
    }

    return classData;
  } catch (error) {
    console.error('Error saving class:', error);
    throw error;
  }
};
