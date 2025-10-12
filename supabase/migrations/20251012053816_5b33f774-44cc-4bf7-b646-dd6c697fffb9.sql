-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT CHECK (role IN ('student', 'tutor', 'admin')),
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  delivery_mode TEXT CHECK (delivery_mode IN ('online', 'offline')) DEFAULT 'online',
  class_format TEXT CHECK (class_format IN ('live', 'recorded', 'inbound', 'outbound')) DEFAULT 'live',
  class_size TEXT CHECK (class_size IN ('group', 'one-on-one')) DEFAULT 'group',
  duration_type TEXT CHECK (duration_type IN ('recurring', 'fixed')) DEFAULT 'recurring',
  pricing_model TEXT,
  required_subscription_tier TEXT,
  status TEXT CHECK (status IN ('draft', 'active', 'inactive', 'completed', 'running')) DEFAULT 'draft',
  price DECIMAL(10, 2),
  monthly_charges DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  max_students INTEGER,
  auto_renewal BOOLEAN DEFAULT false,
  thumbnail_url TEXT,
  enrollment_deadline DATE,
  tutor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  batch_number INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create class_locations table
CREATE TABLE IF NOT EXISTS public.class_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  meeting_link TEXT,
  street TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create class_time_slots table
CREATE TABLE IF NOT EXISTS public.class_time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create class_schedules table
CREATE TABLE IF NOT EXISTS public.class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  start_date DATE,
  end_date DATE,
  frequency TEXT,
  total_sessions INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create class_syllabus table
CREATE TABLE IF NOT EXISTS public.class_syllabus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  session_date DATE,
  start_time TIME,
  end_time TIME,
  status TEXT,
  attendance TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create lesson_materials table
CREATE TABLE IF NOT EXISTS public.lesson_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.class_syllabus(id) ON DELETE CASCADE,
  material_name TEXT NOT NULL,
  material_type TEXT NOT NULL,
  material_url TEXT NOT NULL,
  file_path TEXT,
  file_size BIGINT,
  display_order INTEGER DEFAULT 0,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student_enrollments table
CREATE TABLE IF NOT EXISTS public.student_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT CHECK (status IN ('active', 'completed', 'cancelled', 'pending')) DEFAULT 'active',
  payment_status TEXT CHECK (payment_status IN ('paid', 'pending', 'failed')) DEFAULT 'pending',
  batch_number INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(class_id, student_id, batch_number)
);

-- Create class_reviews table
CREATE TABLE IF NOT EXISTS public.class_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(class_id, student_id)
);

-- Create session_attendance table
CREATE TABLE IF NOT EXISTS public.session_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.class_syllabus(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('present', 'absent', 'excused')) DEFAULT 'absent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(session_id, student_id)
);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  billing_period TEXT CHECK (billing_period IN ('monthly', 'yearly')) DEFAULT 'monthly',
  stripe_price_id TEXT,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(participant1_id, participant2_id, class_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_syllabus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for classes
CREATE POLICY "Anyone can view active classes"
  ON public.classes FOR SELECT
  USING (status = 'active' OR tutor_id = auth.uid());

CREATE POLICY "Tutors can create classes"
  ON public.classes FOR INSERT
  WITH CHECK (auth.uid() = tutor_id);

CREATE POLICY "Tutors can update their own classes"
  ON public.classes FOR UPDATE
  USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can delete their own classes"
  ON public.classes FOR DELETE
  USING (auth.uid() = tutor_id);

-- RLS Policies for class_locations
CREATE POLICY "Anyone can view class locations for active classes"
  ON public.class_locations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = class_locations.class_id
      AND (classes.status = 'active' OR classes.tutor_id = auth.uid())
    )
  );

CREATE POLICY "Tutors can manage their class locations"
  ON public.class_locations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = class_locations.class_id
      AND classes.tutor_id = auth.uid()
    )
  );

-- RLS Policies for class_time_slots
CREATE POLICY "Anyone can view time slots for active classes"
  ON public.class_time_slots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = class_time_slots.class_id
      AND (classes.status = 'active' OR classes.tutor_id = auth.uid())
    )
  );

CREATE POLICY "Tutors can manage their class time slots"
  ON public.class_time_slots FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = class_time_slots.class_id
      AND classes.tutor_id = auth.uid()
    )
  );

-- RLS Policies for class_schedules
CREATE POLICY "Anyone can view schedules for active classes"
  ON public.class_schedules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = class_schedules.class_id
      AND (classes.status = 'active' OR classes.tutor_id = auth.uid())
    )
  );

CREATE POLICY "Tutors can manage their class schedules"
  ON public.class_schedules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = class_schedules.class_id
      AND classes.tutor_id = auth.uid()
    )
  );

-- RLS Policies for class_syllabus
CREATE POLICY "Enrolled students and tutors can view syllabus"
  ON public.class_syllabus FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = class_syllabus.class_id
      AND (
        classes.tutor_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.student_enrollments
          WHERE student_enrollments.class_id = classes.id
          AND student_enrollments.student_id = auth.uid()
          AND student_enrollments.status = 'active'
        )
      )
    )
  );

CREATE POLICY "Tutors can manage their class syllabus"
  ON public.class_syllabus FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = class_syllabus.class_id
      AND classes.tutor_id = auth.uid()
    )
  );

-- RLS Policies for lesson_materials
CREATE POLICY "Enrolled students and tutors can view materials"
  ON public.lesson_materials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.class_syllabus
      JOIN public.classes ON classes.id = class_syllabus.class_id
      WHERE class_syllabus.id = lesson_materials.lesson_id
      AND (
        classes.tutor_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.student_enrollments
          WHERE student_enrollments.class_id = classes.id
          AND student_enrollments.student_id = auth.uid()
          AND student_enrollments.status = 'active'
        )
      )
    )
  );

CREATE POLICY "Tutors can manage lesson materials"
  ON public.lesson_materials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.class_syllabus
      JOIN public.classes ON classes.id = class_syllabus.class_id
      WHERE class_syllabus.id = lesson_materials.lesson_id
      AND classes.tutor_id = auth.uid()
    )
  );

-- RLS Policies for student_enrollments
CREATE POLICY "Students can view their own enrollments"
  ON public.student_enrollments FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Tutors can view enrollments for their classes"
  ON public.student_enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classes
      WHERE classes.id = student_enrollments.class_id
      AND classes.tutor_id = auth.uid()
    )
  );

CREATE POLICY "Students can enroll in classes"
  ON public.student_enrollments FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their enrollments"
  ON public.student_enrollments FOR UPDATE
  USING (student_id = auth.uid());

-- RLS Policies for class_reviews
CREATE POLICY "Anyone can view reviews"
  ON public.class_reviews FOR SELECT
  USING (true);

CREATE POLICY "Enrolled students can create reviews"
  ON public.class_reviews FOR INSERT
  WITH CHECK (
    student_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.student_enrollments
      WHERE student_enrollments.class_id = class_reviews.class_id
      AND student_enrollments.student_id = auth.uid()
      AND student_enrollments.status = 'active'
    )
  );

CREATE POLICY "Students can update their own reviews"
  ON public.class_reviews FOR UPDATE
  USING (student_id = auth.uid());

-- RLS Policies for session_attendance
CREATE POLICY "Students can view their own attendance"
  ON public.session_attendance FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Tutors can view and manage attendance"
  ON public.session_attendance FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.class_syllabus
      JOIN public.classes ON classes.id = class_syllabus.class_id
      WHERE class_syllabus.id = session_attendance.session_id
      AND classes.tutor_id = auth.uid()
    )
  );

-- RLS Policies for subscription_plans
CREATE POLICY "Anyone can view active subscription plans"
  ON public.subscription_plans FOR SELECT
  USING (is_active = true);

-- RLS Policies for conversations
CREATE POLICY "Users can view their own conversations"
  ON public.conversations FOR SELECT
  USING (participant1_id = auth.uid() OR participant2_id = auth.uid());

CREATE POLICY "Users can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (participant1_id = auth.uid() OR participant2_id = auth.uid());

CREATE POLICY "Users can update their conversations"
  ON public.conversations FOR UPDATE
  USING (participant1_id = auth.uid() OR participant2_id = auth.uid());

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their messages"
  ON public.messages FOR UPDATE
  USING (sender_id = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_class_syllabus_updated_at
  BEFORE UPDATE ON public.class_syllabus
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_enrollments_updated_at
  BEFORE UPDATE ON public.student_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_class_reviews_updated_at
  BEFORE UPDATE ON public.class_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function for creating class batches
CREATE OR REPLACE FUNCTION public.create_class_batch(
  original_class_id UUID,
  tutor_id_param UUID
)
RETURNS UUID AS $$
DECLARE
  new_class_id UUID;
  max_batch_number INTEGER;
BEGIN
  -- Get the max batch number for this class
  SELECT COALESCE(MAX(batch_number), 0) INTO max_batch_number
  FROM public.classes
  WHERE id = original_class_id;

  -- Create new class with incremented batch number
  INSERT INTO public.classes (
    title, description, subject, delivery_mode, class_format,
    class_size, duration_type, pricing_model, required_subscription_tier,
    status, price, monthly_charges, currency, max_students,
    auto_renewal, thumbnail_url, enrollment_deadline, tutor_id, batch_number
  )
  SELECT
    title, description, subject, delivery_mode, class_format,
    class_size, duration_type, pricing_model, required_subscription_tier,
    'draft', price, monthly_charges, currency, max_students,
    auto_renewal, thumbnail_url, enrollment_deadline, tutor_id_param, max_batch_number + 1
  FROM public.classes
  WHERE id = original_class_id
  RETURNING id INTO new_class_id;

  RETURN new_class_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;