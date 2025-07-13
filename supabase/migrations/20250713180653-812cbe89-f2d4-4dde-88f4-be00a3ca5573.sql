-- Add batch_number to classes table with default value 1 for existing records
ALTER TABLE public.classes 
ADD COLUMN batch_number INTEGER NOT NULL DEFAULT 1;

-- Add batch_number to student_enrollments table with default value 1 for existing records  
ALTER TABLE public.student_enrollments
ADD COLUMN batch_number INTEGER NOT NULL DEFAULT 1;

-- Create index on classes for efficient querying by class_id and batch_number
CREATE INDEX idx_classes_batch ON public.classes(id, batch_number);

-- Create index on student_enrollments for efficient querying
CREATE INDEX idx_enrollments_batch ON public.student_enrollments(class_id, batch_number);

-- Drop dependent policies first
DROP POLICY IF EXISTS "Students can view schedules for enrolled classes" ON public.class_schedules;
DROP POLICY IF EXISTS "Students can view time slots for enrolled classes" ON public.class_time_slots;
DROP POLICY IF EXISTS "Students can view classes they are enrolled in" ON public.classes;

-- Drop and recreate the function
DROP FUNCTION IF EXISTS public.is_student_enrolled_in_class(uuid, uuid);

CREATE OR REPLACE FUNCTION public.is_student_enrolled_in_class(class_id_param uuid, student_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.student_enrollments se
    JOIN public.classes c ON c.id = se.class_id AND c.batch_number = se.batch_number
    WHERE se.class_id = class_id_param 
    AND se.student_id = student_id_param
    AND c.status IN ('active', 'running', 'completed')
  );
$function$;

-- Recreate the dropped policies
CREATE POLICY "Students can view schedules for enrolled classes" 
ON public.class_schedules 
FOR SELECT 
USING (is_student_enrolled_in_class(class_id, auth.uid()));

CREATE POLICY "Students can view time slots for enrolled classes" 
ON public.class_time_slots 
FOR SELECT 
USING (is_student_enrolled_in_class(class_id, auth.uid()));

CREATE POLICY "Students can view classes they are enrolled in" 
ON public.classes 
FOR SELECT 
USING (is_student_enrolled_in_class(id, auth.uid()));

-- Create function to get latest batch number for a class
CREATE OR REPLACE FUNCTION public.get_latest_batch_number(class_id_param uuid)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT COALESCE(MAX(batch_number), 0)
  FROM public.classes
  WHERE id = class_id_param;
$function$;

-- Create function to create new batch of a class
CREATE OR REPLACE FUNCTION public.create_class_batch(
  original_class_id uuid,
  tutor_id_param uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  new_batch_number integer;
  new_class_id uuid;
  original_class_data record;
BEGIN
  -- Check if the tutor owns the original class
  SELECT * INTO original_class_data
  FROM public.classes
  WHERE id = original_class_id 
  AND tutor_id = tutor_id_param 
  AND status = 'completed';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Class not found or not owned by tutor or not completed';
  END IF;
  
  -- Get next batch number
  SELECT COALESCE(MAX(batch_number), 0) + 1 INTO new_batch_number
  FROM public.classes
  WHERE id = original_class_id;
  
  -- Generate new UUID for the new batch
  new_class_id := gen_random_uuid();
  
  -- Create new class record with incremented batch number
  INSERT INTO public.classes (
    id, title, description, subject, delivery_mode, class_format, 
    class_size, duration_type, price, currency, max_students, 
    auto_renewal, enrollment_deadline, thumbnail_url, tutor_id, 
    status, batch_number
  )
  SELECT 
    new_class_id, title, description, subject, delivery_mode, class_format,
    class_size, duration_type, price, currency, max_students,
    auto_renewal, enrollment_deadline, thumbnail_url, tutor_id,
    'draft'::class_status, new_batch_number
  FROM public.classes
  WHERE id = original_class_id AND batch_number = original_class_data.batch_number;
  
  -- Copy class schedules
  INSERT INTO public.class_schedules (class_id, start_date, end_date, frequency, total_sessions)
  SELECT new_class_id, start_date, end_date, frequency, total_sessions
  FROM public.class_schedules
  WHERE class_id = original_class_id;
  
  -- Copy class locations
  INSERT INTO public.class_locations (class_id, street, city, state, zip_code, country, meeting_link)
  SELECT new_class_id, street, city, state, zip_code, country, meeting_link
  FROM public.class_locations
  WHERE class_id = original_class_id;
  
  -- Copy time slots
  INSERT INTO public.class_time_slots (class_id, day_of_week, start_time, end_time)
  SELECT new_class_id, day_of_week, start_time, end_time
  FROM public.class_time_slots
  WHERE class_id = original_class_id;
  
  -- Copy syllabus
  INSERT INTO public.class_syllabus (class_id, week_number, title, description, learning_objectives, session_date, start_time, end_time, status)
  SELECT new_class_id, week_number, title, description, learning_objectives, session_date, start_time, end_time, 'upcoming'::text
  FROM public.class_syllabus
  WHERE class_id = original_class_id;
  
  RETURN new_class_id;
END;
$function$;