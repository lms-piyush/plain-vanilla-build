
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
