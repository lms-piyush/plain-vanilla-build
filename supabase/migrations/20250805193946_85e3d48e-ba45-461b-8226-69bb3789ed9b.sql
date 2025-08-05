-- Create saved_classes table for student wishlist functionality
CREATE TABLE public.saved_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  class_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, class_id)
);

-- Enable RLS on saved_classes
ALTER TABLE public.saved_classes ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_classes
CREATE POLICY "Students can view their own saved classes" 
ON public.saved_classes 
FOR SELECT 
USING (auth.uid() = student_id);

CREATE POLICY "Students can create their own saved classes" 
ON public.saved_classes 
FOR INSERT 
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can delete their own saved classes" 
ON public.saved_classes 
FOR DELETE 
USING (auth.uid() = student_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_saved_classes_updated_at
BEFORE UPDATE ON public.saved_classes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();