-- Drop the existing unique constraint that only considers student_id and class_id
ALTER TABLE public.student_enrollments 
DROP CONSTRAINT IF EXISTS student_enrollments_student_id_class_id_key;

-- Create a new unique constraint that includes batch_number
ALTER TABLE public.student_enrollments 
ADD CONSTRAINT student_enrollments_student_id_class_id_batch_key 
UNIQUE (student_id, class_id, batch_number);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_student_enrollments_batch_lookup 
ON public.student_enrollments(student_id, class_id, batch_number);