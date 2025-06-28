
-- Add enrollment_deadline column to classes table
ALTER TABLE public.classes 
ADD COLUMN enrollment_deadline date;

-- Add comment to document the field
COMMENT ON COLUMN public.classes.enrollment_deadline IS 'Last date students can enroll in this class';
