
import { supabase } from "@/integrations/supabase/client";
import { ClassCreationState } from "@/hooks/use-class-creation-store";
import { saveLessonMaterials } from "./lesson-materials-service";

export const saveClass = async (formState: ClassCreationState, status: 'draft' | 'active') => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in to create a class');

  // Create the main class record
  const { data: classData, error: classError } = await supabase
    .from('classes')
    .insert({
      title: formState.title,
      description: formState.description,
      subject: formState.subject,
      delivery_mode: formState.deliveryMode,
      class_format: formState.classFormat,
      class_size: formState.classSize,
      duration_type: formState.durationType,
      status: status,
      price: formState.price || 0,
      currency: formState.currency,
      max_students: formState.maxStudents,
      auto_renewal: formState.autoRenewal,
      thumbnail_url: formState.thumbnailUrl,
      tutor_id: user.id
    })
    .select('id')
    .single();

  if (classError) throw classError;
  const classId = classData.id;

  // Save schedule if available
  if (formState.startDate) {
    await supabase.from('class_schedules').insert({
      class_id: classId,
      start_date: formState.startDate,
      end_date: formState.endDate,
      frequency: formState.frequency
    });
  }

  // Save time slots
  if (formState.timeSlots.length > 0) {
    await supabase.from('class_time_slots').insert(
      formState.timeSlots.map(slot => ({
        class_id: classId,
        day_of_week: slot.day,
        start_time: slot.startTime,
        end_time: slot.endTime
      }))
    );
  }

  // Save location information
  const locationData: any = { class_id: classId };
  if (formState.deliveryMode === 'online' && formState.meetingLink) {
    locationData.meeting_link = formState.meetingLink;
  } else if (formState.deliveryMode === 'offline') {
    locationData.street_address = formState.address.street;
    locationData.city = formState.address.city;
    locationData.state = formState.address.state;
    locationData.zip_code = formState.address.zipCode;
    locationData.country = formState.address.country;
  }
  
  if (Object.keys(locationData).length > 1) {
    await supabase.from('class_locations').insert(locationData);
  }

  // Save syllabus and materials
  if (formState.syllabus.length > 0) {
    const syllabusPromises = formState.syllabus.map(async (item, index) => {
      const { data: lessonData, error: lessonError } = await supabase
        .from('class_syllabus')
        .insert({
          class_id: classId,
          title: item.title,
          description: item.description,
          week_number: index + 1
        })
        .select('id')
        .single();

      if (lessonError) throw lessonError;

      // Save materials for this lesson if any exist
      const lessonMaterials = formState.materials.filter(material => 
        material.lessonIndex === index
      );
      
      if (lessonMaterials.length > 0) {
        const materialsData = lessonMaterials.map((material, materialIndex) => ({
          material_name: material.name,
          material_type: material.type,
          material_url: material.url,
          display_order: materialIndex
        }));
        
        await saveLessonMaterials(lessonData.id, materialsData);
      }
    });

    await Promise.all(syllabusPromises);
  }

  console.log('Class created successfully with ID:', classId);
  return classId;
};
