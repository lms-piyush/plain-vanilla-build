
-- Create a security definer function to check if user is enrolled in a class
CREATE OR REPLACE FUNCTION public.is_student_enrolled_in_class(class_id_param uuid, student_id_param uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.student_enrollments 
    WHERE class_id = class_id_param 
    AND student_id = student_id_param
  );
$$;

-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Students can view schedules for enrolled classes" ON public.class_schedules;
DROP POLICY IF EXISTS "Students can view time slots for enrolled classes" ON public.class_time_slots;
DROP POLICY IF EXISTS "Students can view classes they are enrolled in" ON public.classes;

-- Recreate the policies using the security definer function
CREATE POLICY "Students can view schedules for enrolled classes" 
ON public.class_schedules 
FOR SELECT 
USING (public.is_student_enrolled_in_class(class_schedules.class_id, auth.uid()));

CREATE POLICY "Students can view time slots for enrolled classes" 
ON public.class_time_slots 
FOR SELECT 
USING (public.is_student_enrolled_in_class(class_time_slots.class_id, auth.uid()));

CREATE POLICY "Students can view classes they are enrolled in" 
ON public.classes 
FOR SELECT 
USING (public.is_student_enrolled_in_class(classes.id, auth.uid()));
