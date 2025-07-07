export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      class_locations: {
        Row: {
          city: string | null
          class_id: string
          country: string | null
          created_at: string
          id: string
          meeting_link: string | null
          state: string | null
          street: string | null
          zip_code: string | null
        }
        Insert: {
          city?: string | null
          class_id: string
          country?: string | null
          created_at?: string
          id?: string
          meeting_link?: string | null
          state?: string | null
          street?: string | null
          zip_code?: string | null
        }
        Update: {
          city?: string | null
          class_id?: string
          country?: string | null
          created_at?: string
          id?: string
          meeting_link?: string | null
          state?: string | null
          street?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_locations_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_reviews: {
        Row: {
          class_id: string
          created_at: string
          id: string
          rating: number
          review_text: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          rating: number
          review_text?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          rating?: number
          review_text?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_class_reviews_class_id"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_class_reviews_student_id"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      class_schedules: {
        Row: {
          class_id: string
          created_at: string
          end_date: string | null
          frequency: string | null
          id: string
          start_date: string | null
          total_sessions: number | null
        }
        Insert: {
          class_id: string
          created_at?: string
          end_date?: string | null
          frequency?: string | null
          id?: string
          start_date?: string | null
          total_sessions?: number | null
        }
        Update: {
          class_id?: string
          created_at?: string
          end_date?: string | null
          frequency?: string | null
          id?: string
          start_date?: string | null
          total_sessions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "class_schedules_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_syllabus: {
        Row: {
          attendance: string | null
          class_id: string
          created_at: string
          description: string | null
          end_time: string | null
          id: string
          is_completed: boolean | null
          learning_objectives: string[] | null
          notes: string | null
          session_date: string | null
          start_time: string | null
          status: string | null
          title: string
          week_number: number
        }
        Insert: {
          attendance?: string | null
          class_id: string
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          learning_objectives?: string[] | null
          notes?: string | null
          session_date?: string | null
          start_time?: string | null
          status?: string | null
          title: string
          week_number: number
        }
        Update: {
          attendance?: string | null
          class_id?: string
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          learning_objectives?: string[] | null
          notes?: string | null
          session_date?: string | null
          start_time?: string | null
          status?: string | null
          title?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "class_syllabus_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_time_slots: {
        Row: {
          class_id: string
          created_at: string
          day_of_week: string
          end_time: string
          id: string
          start_time: string
        }
        Insert: {
          class_id: string
          created_at?: string
          day_of_week: string
          end_time: string
          id?: string
          start_time: string
        }
        Update: {
          class_id?: string
          created_at?: string
          day_of_week?: string
          end_time?: string
          id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_time_slots_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          auto_renewal: boolean | null
          class_format: Database["public"]["Enums"]["class_format"]
          class_size: Database["public"]["Enums"]["class_size"]
          created_at: string
          currency: string | null
          delivery_mode: Database["public"]["Enums"]["delivery_mode"]
          description: string | null
          duration_type: Database["public"]["Enums"]["duration_type"]
          enrollment_deadline: string | null
          id: string
          max_students: number | null
          price: number | null
          status: Database["public"]["Enums"]["class_status"]
          subject: string | null
          thumbnail_url: string | null
          title: string
          tutor_id: string
          updated_at: string
        }
        Insert: {
          auto_renewal?: boolean | null
          class_format: Database["public"]["Enums"]["class_format"]
          class_size: Database["public"]["Enums"]["class_size"]
          created_at?: string
          currency?: string | null
          delivery_mode: Database["public"]["Enums"]["delivery_mode"]
          description?: string | null
          duration_type: Database["public"]["Enums"]["duration_type"]
          enrollment_deadline?: string | null
          id?: string
          max_students?: number | null
          price?: number | null
          status?: Database["public"]["Enums"]["class_status"]
          subject?: string | null
          thumbnail_url?: string | null
          title: string
          tutor_id: string
          updated_at?: string
        }
        Update: {
          auto_renewal?: boolean | null
          class_format?: Database["public"]["Enums"]["class_format"]
          class_size?: Database["public"]["Enums"]["class_size"]
          created_at?: string
          currency?: string | null
          delivery_mode?: Database["public"]["Enums"]["delivery_mode"]
          description?: string | null
          duration_type?: Database["public"]["Enums"]["duration_type"]
          enrollment_deadline?: string | null
          id?: string
          max_students?: number | null
          price?: number | null
          status?: Database["public"]["Enums"]["class_status"]
          subject?: string | null
          thumbnail_url?: string | null
          title?: string
          tutor_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          class_id: string
          created_at: string
          id: string
          last_message: string | null
          last_message_at: string
          student_id: string
          tutor_id: string
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string
          student_id: string
          tutor_id: string
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string
          student_id?: string
          tutor_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_student_id_fkey1"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_tutor_id_fkey1"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_materials: {
        Row: {
          created_at: string
          display_order: number | null
          download_count: number | null
          file_path: string | null
          file_size: number | null
          id: string
          lesson_id: string
          material_name: string
          material_type: string
          material_url: string
          updated_at: string
          upload_date: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          download_count?: number | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          lesson_id: string
          material_name: string
          material_type: string
          material_url: string
          updated_at?: string
          upload_date?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number | null
          download_count?: number | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          lesson_id?: string
          material_name?: string
          material_type?: string
          material_url?: string
          updated_at?: string
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_lesson_materials_lesson_id"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "class_syllabus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_materials_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "class_syllabus"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean
          recipient_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey1"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey1"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      session_attendance: {
        Row: {
          created_at: string
          id: string
          marked_at: string
          session_id: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          marked_at?: string
          session_id: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          marked_at?: string
          session_id?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_attendance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "class_syllabus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_enrollments: {
        Row: {
          class_id: string
          created_at: string
          enrollment_date: string
          id: string
          payment_status: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          enrollment_date?: string
          id?: string
          payment_status?: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          enrollment_date?: string
          id?: string
          payment_status?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_enrollments_student_id_fkey1"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tutor_reviews: {
        Row: {
          created_at: string
          id: string
          rating: number
          review_text: string | null
          student_id: string
          tutor_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          rating: number
          review_text?: string | null
          student_id: string
          tutor_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          review_text?: string | null
          student_id?: string
          tutor_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_tutor_reviews_student_id"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tutor_reviews_tutor_id"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_student_enrolled_in_class: {
        Args: { class_id_param: string; student_id_param: string }
        Returns: boolean
      }
      update_class_statuses: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      class_format: "live" | "recorded" | "inbound" | "outbound"
      class_size: "group" | "one-on-one"
      class_status: "draft" | "active" | "inactive" | "completed" | "running"
      delivery_mode: "online" | "offline"
      duration_type: "recurring" | "fixed"
      user_role: "student" | "parent" | "tutor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      class_format: ["live", "recorded", "inbound", "outbound"],
      class_size: ["group", "one-on-one"],
      class_status: ["draft", "active", "inactive", "completed", "running"],
      delivery_mode: ["online", "offline"],
      duration_type: ["recurring", "fixed"],
      user_role: ["student", "parent", "tutor"],
    },
  },
} as const
