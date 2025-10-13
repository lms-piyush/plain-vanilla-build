-- Create children/wards table for parents to manage their children
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  grade_level TEXT,
  date_of_birth DATE,
  interests TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT children_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS on children table
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

-- RLS Policies for children table
CREATE POLICY "Parents can view their own children"
ON public.children
FOR SELECT
TO authenticated
USING (parent_id = auth.uid());

CREATE POLICY "Parents can insert their own children"
ON public.children
FOR INSERT
TO authenticated
WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Parents can update their own children"
ON public.children
FOR UPDATE
TO authenticated
USING (parent_id = auth.uid());

CREATE POLICY "Parents can delete their own children"
ON public.children
FOR DELETE
TO authenticated
USING (parent_id = auth.uid());

-- Add child_id to student_enrollments to track which child the enrollment is for
ALTER TABLE public.student_enrollments
ADD COLUMN child_id UUID REFERENCES public.children(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_children_parent_id ON public.children(parent_id);
CREATE INDEX idx_student_enrollments_child_id ON public.student_enrollments(child_id);

-- Create trigger for updating children updated_at timestamp
CREATE TRIGGER update_children_updated_at
BEFORE UPDATE ON public.children
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();