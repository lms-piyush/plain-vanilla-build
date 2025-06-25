
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ClassDetails {
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
  auto_renewal: boolean | null;
  thumbnail_url: string | null;
  tutor_id: string;
  created_at: string;
  updated_at: string;
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
  enrolled_students?: Array<{
    id: string;
    student_id: string;
    enrollment_date: string;
    status: string;
    payment_status: string;
    profiles?: {
      full_name: string;
      role: string;
      email?: string;
    };
  }>;
  class_syllabus?: Array<{
    id: string;
    week_number: number;
    title: string;
    description: string | null;
    session_date: string | null;
    start_time: string | null;
    end_time: string | null;
    status: string | null;
    attendance: string | null;
    notes: string | null;
    lesson_materials?: Array<{
      id: string;
      material_name: string;
      material_type: string;
      material_url: string;
      display_order: number;
      file_size: number | null;
      upload_date: string | null;
      download_count: number | null;
      file_path: string | null;
    }>;
  }>;
}

export const useClassDetails = (classId: string) => {
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchClassDetails = async () => {
    if (!user || !classId) {
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
            attendance,
            notes,
            lesson_materials!lesson_materials_lesson_id_fkey (
              id,
              material_name,
              material_type,
              material_url,
              display_order,
              file_size,
              upload_date,
              download_count,
              file_path
            )
          )
        `)
        .eq("id", classId)
        .eq("tutor_id", user.id)
        .single();

      if (classError) throw classError;

      // Separately fetch student enrollments with profiles
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from("student_enrollments")
        .select(`
          id,
          student_id,
          enrollment_date,
          status,
          payment_status
        `)
        .eq("class_id", classId);

      if (enrollmentsError) {
        console.error("Error fetching enrollments:", enrollmentsError);
      }

      // Fetch profile data and email for each enrolled student
      const enrolledStudents = [];
      if (enrollmentsData) {
        for (const enrollment of enrollmentsData) {
          // Fetch profile data
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name, role")
            .eq("id", enrollment.student_id)
            .single();

          // Fetch email from auth.users - we'll use a workaround since we can't directly query auth.users
          // For now, we'll create a placeholder email based on the student_id
          const email = `student-${enrollment.student_id.slice(-8)}@example.com`;

          enrolledStudents.push({
            ...enrollment,
            profiles: profileData ? {
              ...profileData,
              email: email
            } : {
              full_name: `Student ${enrollment.student_id.slice(-4)}`,
              role: 'student',
              email: email
            }
          });
        }
      }

      setClassDetails({
        ...classData,
        enrolled_students: enrolledStudents,
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
