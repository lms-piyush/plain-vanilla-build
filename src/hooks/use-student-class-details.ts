
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface StudentClassDetails {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  delivery_mode: 'online' | 'offline';
  class_format: 'live' | 'recorded' | 'inbound' | 'outbound';
  class_size: 'group' | 'one-on-one';
  duration_type: 'recurring' | 'fixed';
  status: 'draft' | 'active' | 'inactive' | 'completed';
  price: number | null;
  currency: string | null;
  max_students: number | null;
  thumbnail_url: string | null;
  tutor_id: string;
  created_at: string;
  updated_at: string;
  tutor_name: string;
  class_locations?: Array<{
    meeting_link: string | null;
    street: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    country: string | null;
  }>;
  class_time_slots?: Array<{
    id: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
  }>;
  class_schedules?: Array<{
    id: string;
    start_date: string | null;
    end_date: string | null;
    frequency: string | null;
    total_sessions: number | null;
  }>;
  lessons?: Array<{
    id: string;
    week_number: number;
    title: string;
    description: string | null;
    session_date: string | null;
    start_time: string | null;
    end_time: string | null;
    status: string | null;
    is_completed: boolean;
    materials: Array<{
      id: string;
      material_name: string;
      material_type: string;
      material_url: string;
      display_order: number;
      file_size: number | null;
    }>;
  }>;
  isEnrolled: boolean;
}

export const useStudentClassDetails = (classId: string) => {
  const [classDetails, setClassDetails] = useState<StudentClassDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchClassDetails = async () => {
    if (!classId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // First, fetch the main class data
      const { data: classData, error: classError } = await supabase
        .from("classes")
        .select(`
          *,
          class_locations!class_locations_class_id_fkey (
            meeting_link,
            street,
            city,
            state,
            zip_code,
            country
          ),
          class_time_slots!class_time_slots_class_id_fkey (
            id,
            day_of_week,
            start_time,
            end_time
          ),
          class_schedules!class_schedules_class_id_fkey (
            id,
            start_date,
            end_date,
            frequency,
            total_sessions
          ),
          class_syllabus!class_syllabus_class_id_fkey (
            id,
            week_number,
            title,
            description,
            session_date,
            start_time,
            end_time,
            status,
            is_completed,
            lesson_materials!lesson_materials_lesson_id_fkey (
              id,
              material_name,
              material_type,
              material_url,
              display_order,
              file_size
            )
          )
        `)
        .eq("id", classId)
        .single();

      if (classError) throw classError;

      // Fetch tutor information with fallback to email
      const { data: tutorInfo, error: tutorError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', classData.tutor_id)
        .single();

      let tutorName = "Unknown Tutor";
      
      if (tutorError) {
        console.error('Error fetching tutor profile:', tutorError);
        // Fallback to fetching email from auth.users if profile fetch fails
        try {
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(classData.tutor_id);
          if (!userError && userData.user?.email) {
            tutorName = userData.user.email;
          }
        } catch (emailError) {
          console.error('Error fetching tutor email:', emailError);
        }
      } else {
        tutorName = tutorInfo?.full_name || "Unknown Tutor";
        
        // If full_name is empty or null, try to get email as fallback
        if (!tutorInfo?.full_name || tutorInfo.full_name.trim() === '') {
          try {
            const { data: userData, error: userError } = await supabase.auth.admin.getUserById(classData.tutor_id);
            if (!userError && userData.user?.email) {
              tutorName = userData.user.email;
            }
          } catch (emailError) {
            console.error('Error fetching tutor email as fallback:', emailError);
          }
        }
      }

      // Check if user is enrolled (only if user is logged in)
      let isEnrolled = false;
      if (user) {
        const { data: enrollment } = await supabase
          .from('student_enrollments')
          .select('id')
          .eq('student_id', user.id)
          .eq('class_id', classId)
          .eq('status', 'active')
          .single();

        isEnrolled = !!enrollment;
      }

      // Transform lessons data
      const lessons = classData.class_syllabus?.map((lesson: any) => ({
        ...lesson,
        materials: lesson.lesson_materials || []
      })) || [];

      // Add dummy data if no lessons exist
      const finalLessons = lessons.length > 0 ? lessons : [
        {
          id: 'dummy-1',
          week_number: 1,
          title: "Introduction and Setup",
          description: "Overview of the subject and setting up the learning environment.",
          session_date: new Date().toISOString().split('T')[0],
          start_time: "18:00:00",
          end_time: "19:30:00",
          status: "upcoming",
          is_completed: false,
          materials: [
            {
              id: 'dummy-mat-1',
              material_name: "Setup Guide.pdf",
              material_type: "pdf",
              material_url: "#",
              display_order: 1,
              file_size: 1024
            },
            {
              id: 'dummy-mat-2',
              material_name: "Introduction Slides.ppt",
              material_type: "presentation",
              material_url: "#",
              display_order: 2,
              file_size: 2048
            }
          ]
        },
        {
          id: 'dummy-2',
          week_number: 2,
          title: "Core Concepts",
          description: "Understanding fundamental concepts and principles.",
          session_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          start_time: "18:00:00",
          end_time: "19:30:00",
          status: "upcoming",
          is_completed: false,
          materials: [
            {
              id: 'dummy-mat-3',
              material_name: "Concepts Cheatsheet.pdf",
              material_type: "pdf",
              material_url: "#",
              display_order: 1,
              file_size: 1536
            }
          ]
        }
      ];

      setClassDetails({
        ...classData,
        tutor_name: tutorName,
        lessons: finalLessons,
        isEnrolled
      });
      setError(null);
    } catch (err: any) {
      console.error("Error fetching class details:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassDetails();
  }, [user, classId]);

  return {
    classDetails,
    isLoading,
    error,
    refetch: fetchClassDetails,
  };
};
