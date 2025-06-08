export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          class_id: string
          created_at: string
          description: string | null
          id: string
          learning_objectives: string[] | null
          title: string
          week_number: number
        }
        Insert: {
          class_id: string
          created_at?: string
          description?: string | null
          id?: string
          learning_objectives?: string[] | null
          title: string
          week_number: number
        }
        Update: {
          class_id?: string
          created_at?: string
          description?: string | null
          id?: string
          learning_objectives?: string[] | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      class_format: "live" | "recorded" | "inbound" | "outbound"
      class_size: "group" | "one-on-one"
      class_status: "draft" | "active" | "inactive" | "completed"
      delivery_mode: "online" | "offline"
      duration_type: "recurring" | "fixed"
      user_role: "student" | "parent" | "tutor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      class_format: ["live", "recorded", "inbound", "outbound"],
      class_size: ["group", "one-on-one"],
      class_status: ["draft", "active", "inactive", "completed"],
      delivery_mode: ["online", "offline"],
      duration_type: ["recurring", "fixed"],
      user_role: ["student", "parent", "tutor"],
    },
  },
} as const
