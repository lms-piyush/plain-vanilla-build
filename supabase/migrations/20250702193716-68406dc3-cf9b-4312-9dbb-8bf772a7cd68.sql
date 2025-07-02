
-- Add policy for students to view class schedules for their enrolled classes
CREATE POLICY "Students can view schedules for enrolled classes" 
ON public.class_schedules 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM student_enrollments se 
    WHERE se.class_id = class_schedules.class_id 
    AND se.student_id = auth.uid()
  )
);

-- Add policy for students to view time slots for their enrolled classes
CREATE POLICY "Students can view time slots for enrolled classes" 
ON public.class_time_slots 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM student_enrollments se 
    WHERE se.class_id = class_time_slots.class_id 
    AND se.student_id = auth.uid()
  )
);

-- Add policy for students to view classes they are enrolled in (in addition to active classes)
CREATE POLICY "Students can view classes they are enrolled in" 
ON public.classes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM student_enrollments se 
    WHERE se.class_id = classes.id 
    AND se.student_id = auth.uid()
  )
);
