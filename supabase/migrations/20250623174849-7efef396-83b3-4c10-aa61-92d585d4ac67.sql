
-- Create the uploads storage bucket for class thumbnails and course materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true);

-- Create RLS policies for the uploads bucket
CREATE POLICY "Allow public access to uploads bucket" ON storage.objects
FOR ALL USING (bucket_id = 'uploads');

-- Create the lesson_materials table to link materials to specific lessons
CREATE TABLE IF NOT EXISTS public.lesson_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.class_syllabus(id) ON DELETE CASCADE NOT NULL,
  material_name TEXT NOT NULL,
  material_type TEXT NOT NULL CHECK (material_type IN ('image', 'video', 'audio', 'pdf', 'document', 'presentation', 'spreadsheet', 'link')),
  material_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.lesson_materials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lesson_materials
CREATE POLICY "Tutors can manage their lesson materials" ON public.lesson_materials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.class_syllabus cs
      JOIN public.classes c ON c.id = cs.class_id
      WHERE cs.id = lesson_materials.lesson_id 
      AND c.tutor_id = auth.uid()
    )
  );

CREATE POLICY "Students can view materials for enrolled classes" ON public.lesson_materials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.student_enrollments se
      JOIN public.classes c ON c.id = se.class_id
      JOIN public.class_syllabus cs ON cs.class_id = c.id
      WHERE cs.id = lesson_materials.lesson_id 
      AND se.student_id = auth.uid()
    )
  );

-- Add trigger for updated_at timestamp
CREATE TRIGGER update_lesson_materials_updated_at
  BEFORE UPDATE ON public.lesson_materials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lesson_materials_lesson_id ON public.lesson_materials(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_materials_display_order ON public.lesson_materials(lesson_id, display_order);
