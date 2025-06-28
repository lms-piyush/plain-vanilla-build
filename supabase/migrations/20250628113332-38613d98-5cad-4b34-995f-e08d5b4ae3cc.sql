
-- Create attendance table to track student attendance for sessions
CREATE TABLE public.session_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES class_syllabus(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent')),
  marked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, student_id)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.session_attendance ENABLE ROW LEVEL SECURITY;

-- Create policy that allows tutors to view attendance for their class sessions
CREATE POLICY "Tutors can view attendance for their sessions" 
  ON public.session_attendance 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM class_syllabus cs
      JOIN classes c ON cs.class_id = c.id
      WHERE cs.id = session_attendance.session_id 
      AND c.tutor_id = auth.uid()
    )
  );

-- Create policy that allows tutors to insert attendance for their class sessions
CREATE POLICY "Tutors can create attendance for their sessions" 
  ON public.session_attendance 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM class_syllabus cs
      JOIN classes c ON cs.class_id = c.id
      WHERE cs.id = session_attendance.session_id 
      AND c.tutor_id = auth.uid()
    )
  );

-- Create policy that allows tutors to update attendance for their class sessions
CREATE POLICY "Tutors can update attendance for their sessions" 
  ON public.session_attendance 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM class_syllabus cs
      JOIN classes c ON cs.class_id = c.id
      WHERE cs.id = session_attendance.session_id 
      AND c.tutor_id = auth.uid()
    )
  );

-- Create policy that allows tutors to delete attendance for their class sessions
CREATE POLICY "Tutors can delete attendance for their sessions" 
  ON public.session_attendance 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM class_syllabus cs
      JOIN classes c ON cs.class_id = c.id
      WHERE cs.id = session_attendance.session_id 
      AND c.tutor_id = auth.uid()
    )
  );

-- Add trigger to update updated_at column
CREATE TRIGGER update_session_attendance_updated_at
  BEFORE UPDATE ON public.session_attendance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
