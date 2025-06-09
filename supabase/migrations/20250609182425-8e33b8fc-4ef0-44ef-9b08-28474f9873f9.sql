
-- Create a table for student class registrations/enrollments
CREATE TABLE public.student_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  enrollment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, class_id)
);

-- Enable Row Level Security
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies for student enrollments
CREATE POLICY "Students can view their own enrollments" 
  ON public.student_enrollments 
  FOR SELECT 
  USING (auth.uid() = student_id);

CREATE POLICY "Students can create their own enrollments" 
  ON public.student_enrollments 
  FOR INSERT 
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own enrollments" 
  ON public.student_enrollments 
  FOR UPDATE 
  USING (auth.uid() = student_id);

-- Tutors can view enrollments for their classes
CREATE POLICY "Tutors can view enrollments for their classes" 
  ON public.student_enrollments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.classes 
      WHERE classes.id = student_enrollments.class_id 
      AND classes.tutor_id = auth.uid()
    )
  );

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_student_enrollments_updated_at
    BEFORE UPDATE ON public.student_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
