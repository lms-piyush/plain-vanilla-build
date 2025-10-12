export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      class_locations: {
        Row: {
          city: string | null
          class_id: string
          country: string | null
          created_at: string | null
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
          created_at?: string | null
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
          created_at?: string | null
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
          created_at: string | null
          id: string
          rating: number
          review_text: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          id?: string
          rating: number
          review_text?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          id?: string
          rating?: number
          review_text?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_reviews_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_schedules: {
        Row: {
          class_id: string
          created_at: string | null
          end_date: string | null
          frequency: string | null
          id: string
          start_date: string | null
          total_sessions: number | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          start_date?: string | null
          total_sessions?: number | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
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
          created_at: string | null
          description: string | null
          end_time: string | null
          id: string
          notes: string | null
          session_date: string | null
          start_time: string | null
          status: string | null
          title: string
          updated_at: string | null
          week_number: number
        }
        Insert: {
          attendance?: string | null
          class_id: string
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          session_date?: string | null
          start_time?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          week_number: number
        }
        Update: {
          attendance?: string | null
          class_id?: string
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          session_date?: string | null
          start_time?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
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
          created_at: string | null
          day_of_week: string
          end_time: string
          id: string
          start_time: string
        }
        Insert: {
          class_id: string
          created_at?: string | null
          day_of_week: string
          end_time: string
          id?: string
          start_time: string
        }
        Update: {
          class_id?: string
          created_at?: string | null
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
          batch_number: number | null
          class_format: string | null
          class_size: string | null
          created_at: string | null
          currency: string | null
          delivery_mode: string | null
          description: string | null
          duration_type: string | null
          enrollment_deadline: string | null
          id: string
          max_students: number | null
          monthly_charges: number | null
          price: number | null
          pricing_model: string | null
          required_subscription_tier: string | null
          status: string | null
          subject: string | null
          thumbnail_url: string | null
          title: string
          tutor_id: string
          updated_at: string | null
        }
        Insert: {
          auto_renewal?: boolean | null
          batch_number?: number | null
          class_format?: string | null
          class_size?: string | null
          created_at?: string | null
          currency?: string | null
          delivery_mode?: string | null
          description?: string | null
          duration_type?: string | null
          enrollment_deadline?: string | null
          id?: string
          max_students?: number | null
          monthly_charges?: number | null
          price?: number | null
          pricing_model?: string | null
          required_subscription_tier?: string | null
          status?: string | null
          subject?: string | null
          thumbnail_url?: string | null
          title: string
          tutor_id: string
          updated_at?: string | null
        }
        Update: {
          auto_renewal?: boolean | null
          batch_number?: number | null
          class_format?: string | null
          class_size?: string | null
          created_at?: string | null
          currency?: string | null
          delivery_mode?: string | null
          description?: string | null
          duration_type?: string | null
          enrollment_deadline?: string | null
          id?: string
          max_students?: number | null
          monthly_charges?: number | null
          price?: number | null
          pricing_model?: string | null
          required_subscription_tier?: string | null
          status?: string | null
          subject?: string | null
          thumbnail_url?: string | null
          title?: string
          tutor_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          class_id: string | null
          created_at: string | null
          id: string
          last_message_at: string | null
          participant1_id: string
          participant2_id: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          participant1_id: string
          participant2_id: string
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          participant1_id?: string
          participant2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lesson_materials: {
        Row: {
          created_at: string | null
          display_order: number | null
          download_count: number | null
          file_path: string | null
          file_size: number | null
          id: string
          lesson_id: string
          material_name: string
          material_type: string
          material_url: string
          upload_date: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          download_count?: number | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          lesson_id: string
          material_name: string
          material_type: string
          material_url: string
          upload_date?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          download_count?: number | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          lesson_id?: string
          material_name?: string
          material_type?: string
          material_url?: string
          upload_date?: string | null
        }
        Relationships: [
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
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message_text: string
          sender_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_text: string
          sender_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_text?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      session_attendance: {
        Row: {
          created_at: string | null
          id: string
          session_id: string
          status: string | null
          student_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          session_id: string
          status?: string | null
          student_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          session_id?: string
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_attendance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "class_syllabus"
            referencedColumns: ["id"]
          },
        ]
      }
      student_enrollments: {
        Row: {
          batch_number: number | null
          class_id: string
          created_at: string | null
          enrollment_date: string | null
          id: string
          payment_status: string | null
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          batch_number?: number | null
          class_id: string
          created_at?: string | null
          enrollment_date?: string | null
          id?: string
          payment_status?: string | null
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          batch_number?: number | null
          class_id?: string
          created_at?: string | null
          enrollment_date?: string | null
          id?: string
          payment_status?: string | null
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          billing_period: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          stripe_price_id: string | null
          updated_at: string | null
        }
        Insert: {
          billing_period?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_period?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_class_batch: {
        Args: { original_class_id: string; tutor_id_param: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
