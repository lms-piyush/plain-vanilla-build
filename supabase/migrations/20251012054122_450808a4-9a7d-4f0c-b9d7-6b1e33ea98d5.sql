-- Fix create_class_batch function with proper search_path
DROP FUNCTION IF EXISTS public.create_class_batch(UUID, UUID);
CREATE OR REPLACE FUNCTION public.create_class_batch(
  original_class_id UUID,
  tutor_id_param UUID
)
RETURNS UUID 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  new_class_id UUID;
  max_batch_number INTEGER;
BEGIN
  -- Get the max batch number for this class
  SELECT COALESCE(MAX(batch_number), 0) INTO max_batch_number
  FROM public.classes
  WHERE id = original_class_id;

  -- Create new class with incremented batch number
  INSERT INTO public.classes (
    title, description, subject, delivery_mode, class_format,
    class_size, duration_type, pricing_model, required_subscription_tier,
    status, price, monthly_charges, currency, max_students,
    auto_renewal, thumbnail_url, enrollment_deadline, tutor_id, batch_number
  )
  SELECT
    title, description, subject, delivery_mode, class_format,
    class_size, duration_type, pricing_model, required_subscription_tier,
    'draft', price, monthly_charges, currency, max_students,
    auto_renewal, thumbnail_url, enrollment_deadline, tutor_id_param, max_batch_number + 1
  FROM public.classes
  WHERE id = original_class_id
  RETURNING id INTO new_class_id;

  RETURN new_class_id;
END;
$$;