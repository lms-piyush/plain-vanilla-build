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
      blog_posts: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      children: {
        Row: {
          age: number | null
          created_at: string | null
          date_of_birth: string | null
          grade_level: string | null
          id: string
          interests: string[] | null
          name: string
          parent_id: string
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          grade_level?: string | null
          id?: string
          interests?: string[] | null
          name: string
          parent_id: string
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          grade_level?: string | null
          id?: string
          interests?: string[] | null
          name?: string
          parent_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
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
      class_recommendations: {
        Row: {
          class_id: string
          created_at: string | null
          id: string
          reason: string | null
          recommendation_score: number | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          id?: string
          reason?: string | null
          recommendation_score?: number | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          id?: string
          reason?: string | null
          recommendation_score?: number | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_recommendations_class_id_fkey"
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
          age_range_max: number | null
          age_range_min: number | null
          auto_renewal: boolean | null
          batch_number: number | null
          class_format: string | null
          class_size: string | null
          class_type: string | null
          created_at: string | null
          currency: string | null
          delivery_mode: string | null
          description: string | null
          duration_minutes: number | null
          duration_type: string | null
          enrollment_deadline: string | null
          id: string
          max_students: number | null
          monthly_charges: number | null
          price: number | null
          pricing_model: string | null
          required_subscription_tier: string | null
          schedule_type: string | null
          status: string | null
          subject: string | null
          thumbnail_url: string | null
          title: string
          tutor_id: string
          updated_at: string | null
        }
        Insert: {
          age_range_max?: number | null
          age_range_min?: number | null
          auto_renewal?: boolean | null
          batch_number?: number | null
          class_format?: string | null
          class_size?: string | null
          class_type?: string | null
          created_at?: string | null
          currency?: string | null
          delivery_mode?: string | null
          description?: string | null
          duration_minutes?: number | null
          duration_type?: string | null
          enrollment_deadline?: string | null
          id?: string
          max_students?: number | null
          monthly_charges?: number | null
          price?: number | null
          pricing_model?: string | null
          required_subscription_tier?: string | null
          schedule_type?: string | null
          status?: string | null
          subject?: string | null
          thumbnail_url?: string | null
          title: string
          tutor_id: string
          updated_at?: string | null
        }
        Update: {
          age_range_max?: number | null
          age_range_min?: number | null
          auto_renewal?: boolean | null
          batch_number?: number | null
          class_format?: string | null
          class_size?: string | null
          class_type?: string | null
          created_at?: string | null
          currency?: string | null
          delivery_mode?: string | null
          description?: string | null
          duration_minutes?: number | null
          duration_type?: string | null
          enrollment_deadline?: string | null
          id?: string
          max_students?: number | null
          monthly_charges?: number | null
          price?: number | null
          pricing_model?: string | null
          required_subscription_tier?: string | null
          schedule_type?: string | null
          status?: string | null
          subject?: string | null
          thumbnail_url?: string | null
          title?: string
          tutor_id?: string
          updated_at?: string | null
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
      recently_viewed_classes: {
        Row: {
          class_id: string
          created_at: string | null
          id: string
          student_id: string
          viewed_at: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          id?: string
          student_id: string
          viewed_at?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          id?: string
          student_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recently_viewed_classes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
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
          child_id: string | null
          class_id: string
          completed_sessions: number | null
          created_at: string | null
          enrollment_date: string | null
          id: string
          last_accessed_at: string | null
          payment_status: string | null
          progress_percentage: number | null
          status: string | null
          student_id: string
          total_sessions: number | null
          updated_at: string | null
        }
        Insert: {
          batch_number?: number | null
          child_id?: string | null
          class_id: string
          completed_sessions?: number | null
          created_at?: string | null
          enrollment_date?: string | null
          id?: string
          last_accessed_at?: string | null
          payment_status?: string | null
          progress_percentage?: number | null
          status?: string | null
          student_id: string
          total_sessions?: number | null
          updated_at?: string | null
        }
        Update: {
          batch_number?: number | null
          child_id?: string | null
          class_id?: string
          completed_sessions?: number | null
          created_at?: string | null
          enrollment_date?: string | null
          id?: string
          last_accessed_at?: string | null
          payment_status?: string | null
          progress_percentage?: number | null
          status?: string | null
          student_id?: string
          total_sessions?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_enrollments_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
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
      support_tickets: {
        Row: {
          created_at: string | null
          id: string
          message: string
          priority: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          priority?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          priority?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tutor_applications: {
        Row: {
          admin_notes: string | null
          bio: string
          certifications: string[] | null
          created_at: string | null
          education: string
          email: string
          experience_years: number
          expertise: string[]
          full_name: string
          id: string
          linkedin_url: string | null
          phone: string | null
          resume_url: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          bio: string
          certifications?: string[] | null
          created_at?: string | null
          education: string
          email: string
          experience_years: number
          expertise: string[]
          full_name: string
          id?: string
          linkedin_url?: string | null
          phone?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          bio?: string
          certifications?: string[] | null
          created_at?: string | null
          education?: string
          email?: string
          experience_years?: number
          expertise?: string[]
          full_name?: string
          id?: string
          linkedin_url?: string | null
          phone?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tutor_bank_accounts: {
        Row: {
          account_holder_name: string
          account_number: string
          account_type: string
          bank_name: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          is_verified: boolean | null
          routing_number: string
          tutor_id: string
          updated_at: string | null
        }
        Insert: {
          account_holder_name: string
          account_number: string
          account_type: string
          bank_name: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          routing_number: string
          tutor_id: string
          updated_at?: string | null
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          account_type?: string
          bank_name?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          routing_number?: string
          tutor_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tutor_earnings: {
        Row: {
          amount: number
          available_at: string | null
          class_id: string | null
          created_at: string | null
          currency: string | null
          earned_at: string | null
          enrollment_id: string | null
          id: string
          net_amount: number
          platform_fee: number | null
          status: string | null
          tutor_id: string
          updated_at: string | null
          withdrawn_at: string | null
        }
        Insert: {
          amount: number
          available_at?: string | null
          class_id?: string | null
          created_at?: string | null
          currency?: string | null
          earned_at?: string | null
          enrollment_id?: string | null
          id?: string
          net_amount: number
          platform_fee?: number | null
          status?: string | null
          tutor_id: string
          updated_at?: string | null
          withdrawn_at?: string | null
        }
        Update: {
          amount?: number
          available_at?: string | null
          class_id?: string | null
          created_at?: string | null
          currency?: string | null
          earned_at?: string | null
          enrollment_id?: string | null
          id?: string
          net_amount?: number
          platform_fee?: number | null
          status?: string | null
          tutor_id?: string
          updated_at?: string | null
          withdrawn_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tutor_earnings_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tutor_earnings_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "student_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          class_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          class_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          class_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          bank_account_id: string | null
          created_at: string | null
          currency: string | null
          id: string
          processed_at: string | null
          rejection_reason: string | null
          requested_at: string | null
          status: string | null
          transaction_reference: string | null
          tutor_id: string
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          bank_account_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          processed_at?: string | null
          rejection_reason?: string | null
          requested_at?: string | null
          status?: string | null
          transaction_reference?: string | null
          tutor_id: string
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          bank_account_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          processed_at?: string | null
          rejection_reason?: string | null
          requested_at?: string | null
          status?: string | null
          transaction_reference?: string | null
          tutor_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "tutor_bank_accounts"
            referencedColumns: ["id"]
          },
        ]
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "student" | "parent" | "tutor"
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
      app_role: ["admin", "student", "parent", "tutor"],
    },
  },
} as const
