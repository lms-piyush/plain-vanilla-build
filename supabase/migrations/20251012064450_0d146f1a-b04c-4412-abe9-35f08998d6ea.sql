-- Retry: seed classes for existing tutor
ALTER TABLE public.classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_time_slots DISABLE ROW LEVEL SECURITY;

WITH t AS (
  SELECT id as tutor_id FROM public.profiles WHERE id IN (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1)
),
cls AS (
  INSERT INTO public.classes (
    title, description, subject, delivery_mode, class_format, class_size,
    pricing_model, status, price, currency, max_students, auto_renewal,
    thumbnail_url, tutor_id, enrollment_deadline
  )
  SELECT v.title, v.description, v.subject, v.delivery_mode, v.class_format, v.class_size,
         v.pricing_model, v.status, v.price, v.currency, v.max_students, v.auto_renewal,
         v.thumbnail_url, t.tutor_id, v.enrollment_deadline
  FROM (
    VALUES
      ('Starter Python','Fun intro to programming.','Coding','online','live','group','per_class','active',25,'USD',12,false,'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', current_date + interval '21 days'),
      ('Sketch & Draw','Learn sketching basics.','Arts','online','live','group','per_class','active',20,'USD',10,false,'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&w=800&q=80', current_date + interval '28 days'),
      ('Public Speaking Basics','Gain confidence speaking.','Life Skills','offline','live','group','per_class','active',30,'USD',10,false,'https://images.unsplash.com/photo-1529078155058-5d716f45d604?auto=format&fit=crop&w=800&q=80', current_date + interval '25 days')
  ) AS v(title, description, subject, delivery_mode, class_format, class_size, pricing_model, status, price, currency, max_students, auto_renewal, thumbnail_url, enrollment_deadline)
  CROSS JOIN t
  RETURNING id
)
INSERT INTO public.class_time_slots (class_id, day_of_week, start_time, end_time)
SELECT id, 'Monday', '16:00'::time, '17:00'::time FROM cls;

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_time_slots ENABLE ROW LEVEL SECURITY;