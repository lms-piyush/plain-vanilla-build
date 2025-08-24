-- View with server-side computed amount and student_count for latest batch
CREATE OR REPLACE VIEW public.tutor_class_summary AS
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