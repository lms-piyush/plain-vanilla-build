-- Add new columns to classes table for enhanced filtering and display
ALTER TABLE public.classes
ADD COLUMN IF NOT EXISTS age_range_min integer,
ADD COLUMN IF NOT EXISTS age_range_max integer,
ADD COLUMN IF NOT EXISTS duration_minutes integer,
ADD COLUMN IF NOT EXISTS class_type text,
ADD COLUMN IF NOT EXISTS schedule_type text;

-- Add comments for clarity
COMMENT ON COLUMN public.classes.age_range_min IS 'Minimum age for students in years';
COMMENT ON COLUMN public.classes.age_range_max IS 'Maximum age for students in years';
COMMENT ON COLUMN public.classes.duration_minutes IS 'Duration of each class session in minutes';
COMMENT ON COLUMN public.classes.class_type IS 'Type of class: academic, life_skills, arts, etc.';
COMMENT ON COLUMN public.classes.schedule_type IS 'Schedule pattern: weekdays, weekends, flexible, etc.';