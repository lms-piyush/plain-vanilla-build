-- Update the create_class_batch function to increment batch_number instead of creating new class
DROP FUNCTION IF EXISTS public.create_class_batch(uuid, uuid);

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
  
  -- Get next batch number for this class
  SELECT COALESCE(MAX(batch_number), 0) + 1 INTO new_batch_number
  FROM public.classes
  WHERE id = original_class_id;
  
  -- Update the existing class with new batch number and reset to draft status
  UPDATE public.classes
  SET 
    batch_number = new_batch_number,
    status = 'draft'::class_status,
    updated_at = now()
  WHERE id = original_class_id;
  
  -- Return the same class_id since we're not creating a new class
  RETURN original_class_id;
END;
$function$;