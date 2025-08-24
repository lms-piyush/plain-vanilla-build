-- Drop the view and recreate with proper RLS
DROP VIEW IF EXISTS public.tutor_class_summary;

-- Create materialized view instead to avoid SECURITY DEFINER issues
CREATE MATERIALIZED VIEW public.tutor_class_summary AS
SELECT
  c.id,
  c.tutor_id,
  c.title,
  c.class_format,
  c.class_size,
  c.duration_type,
  c.price::numeric AS price,
  c.monthly_charges::numeric AS monthly_charges,
  CASE 
    WHEN c.duration_type = 'recurring' THEN COALESCE(c.monthly_charges, c.price)
    ELSE c.price
  END::numeric AS amount,
  c.currency,
  c.created_at,
  c.updated_at,
  c.status,
  c.delivery_mode,
  c.batch_number,
  (
    SELECT COUNT(*)::int
    FROM public.student_enrollments se
    WHERE se.class_id = c.id AND se.batch_number = c.batch_number
  ) AS student_count
FROM public.classes c;

-- Create unique index for primary key
CREATE UNIQUE INDEX tutor_class_summary_pkey ON public.tutor_class_summary (id, batch_number);

-- Enable RLS on the materialized view
ALTER MATERIALIZED VIEW public.tutor_class_summary ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for tutors to see only their own classes
CREATE POLICY "Tutors can view their own class summaries"
ON public.tutor_class_summary
FOR SELECT
USING (tutor_id = auth.uid());

-- Function to refresh the materialized view
CREATE OR REPLACE FUNCTION public.refresh_tutor_class_summary()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.tutor_class_summary;
END;
$$;