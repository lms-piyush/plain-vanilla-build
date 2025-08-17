-- Fix security definer view issues by dropping views and using proper approach
-- Remove the security definer views that were flagged
DROP VIEW IF EXISTS public.tutor_public_profiles;
DROP VIEW IF EXISTS public.public_class_reviews;
DROP VIEW IF EXISTS public.public_tutor_reviews;

-- Fix the remaining function that doesn't have search_path set
CREATE OR REPLACE FUNCTION public.is_student_enrolled_in_class(class_id_param uuid, student_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.student_enrollments se
    JOIN public.classes c ON c.id = se.class_id AND c.batch_number = se.batch_number
    WHERE se.class_id = class_id_param 
    AND se.student_id = student_id_param
    AND c.status IN ('active', 'running', 'completed')
  );
$$;