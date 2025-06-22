
-- Add new columns to existing classes table to support enhanced features
ALTER TABLE public.classes 
ADD COLUMN IF NOT EXISTS frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly')),
ADD COLUMN IF NOT EXISTS total_sessions INTEGER,
ADD COLUMN IF NOT EXISTS auto_renewal BOOLEAN DEFAULT false;

-- Create class_schedules table for managing recurring schedules
CREATE TABLE IF NOT EXISTS public.class_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly')),
  total_sessions INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create class_time_slots table for managing class timing
CREATE TABLE IF NOT EXISTS public.class_time_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create class_locations table for managing physical locations and meeting links
CREATE TABLE IF NOT EXISTS public.class_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  meeting_link TEXT,
  street_address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  location_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create class_materials table for managing course materials and syllabus
CREATE TABLE IF NOT EXISTS public.class_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  material_type TEXT NOT NULL CHECK (material_type IN ('syllabus', 'document', 'video', 'link', 'image')),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_size INTEGER,
  file_format TEXT,
  sort_order INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on new tables
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_materials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for class_schedules
CREATE POLICY "Tutors can manage their class schedules" ON public.class_schedules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.classes 
      WHERE classes.id = class_schedules.class_id 
      AND classes.tutor_id = auth.uid()
    )
  );

CREATE POLICY "Students can view schedules for enrolled classes" ON public.class_schedules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.student_enrollments se
      JOIN public.classes c ON c.id = se.class_id
      WHERE c.id = class_schedules.class_id 
      AND se.student_id = auth.uid()
    )
  );

-- Create RLS policies for class_time_slots
CREATE POLICY "Tutors can manage their class time slots" ON public.class_time_slots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.classes 
      WHERE classes.id = class_time_slots.class_id 
      AND classes.tutor_id = auth.uid()
    )
  );

CREATE POLICY "Students can view time slots for enrolled classes" ON public.class_time_slots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.student_enrollments se
      JOIN public.classes c ON c.id = se.class_id
      WHERE c.id = class_time_slots.class_id 
      AND se.student_id = auth.uid()
    )
  );

-- Create RLS policies for class_locations
CREATE POLICY "Tutors can manage their class locations" ON public.class_locations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.classes 
      WHERE classes.id = class_locations.class_id 
      AND classes.tutor_id = auth.uid()
    )
  );

CREATE POLICY "Students can view locations for enrolled classes" ON public.class_locations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.student_enrollments se
      JOIN public.classes c ON c.id = se.class_id
      WHERE c.id = class_locations.class_id 
      AND se.student_id = auth.uid()
    )
  );

-- Create RLS policies for class_materials
CREATE POLICY "Tutors can manage their class materials" ON public.class_materials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.classes 
      WHERE classes.id = class_materials.class_id 
      AND classes.tutor_id = auth.uid()
    )
  );

CREATE POLICY "Students can view materials for enrolled classes" ON public.class_materials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.student_enrollments se
      JOIN public.classes c ON c.id = se.class_id
      WHERE c.id = class_materials.class_id 
      AND se.student_id = auth.uid()
    )
  );

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_class_schedules_updated_at
  BEFORE UPDATE ON public.class_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_class_time_slots_updated_at
  BEFORE UPDATE ON public.class_time_slots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_class_locations_updated_at
  BEFORE UPDATE ON public.class_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_class_materials_updated_at
  BEFORE UPDATE ON public.class_materials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_class_schedules_class_id ON public.class_schedules(class_id);
CREATE INDEX IF NOT EXISTS idx_class_time_slots_class_id ON public.class_time_slots(class_id);
CREATE INDEX IF NOT EXISTS idx_class_locations_class_id ON public.class_locations(class_id);
CREATE INDEX IF NOT EXISTS idx_class_materials_class_id ON public.class_materials(class_id);
CREATE INDEX IF NOT EXISTS idx_class_materials_type ON public.class_materials(material_type);
