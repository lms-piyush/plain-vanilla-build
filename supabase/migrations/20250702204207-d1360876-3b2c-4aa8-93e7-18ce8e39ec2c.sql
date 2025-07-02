
-- Add unique constraint to prevent multiple reviews from same student for same class
ALTER TABLE public.class_reviews 
ADD CONSTRAINT unique_student_class_review 
UNIQUE (student_id, class_id);

-- Add a function to check if student has already reviewed a class
CREATE OR REPLACE FUNCTION public.has_student_reviewed_class(class_id_param uuid, student_id_param uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.class_reviews 
    WHERE class_id = class_id_param 
    AND student_id = student_id_param
  );
$$;

-- Update class_reviews table to allow updates (needed for review editing)
-- Add updated_at trigger if not exists
CREATE TRIGGER update_class_reviews_updated_at 
    BEFORE UPDATE ON public.class_reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();
