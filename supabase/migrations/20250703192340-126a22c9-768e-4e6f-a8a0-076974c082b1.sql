
-- Update the function to exclude draft classes from status updates
CREATE OR REPLACE FUNCTION public.update_class_statuses()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
BEGIN
  -- Update classes to 'active' if current date is before start_date
  -- Exclude draft classes from being updated
  UPDATE classes 
  SET status = 'active'::class_status, updated_at = now()
  WHERE status != 'draft'::class_status
    AND status != 'active'::class_status
    AND EXISTS (
      SELECT 1 FROM class_schedules 
      WHERE class_schedules.class_id = classes.id 
      AND class_schedules.start_date IS NOT NULL
      AND CURRENT_DATE < class_schedules.start_date
    );

  -- Update classes to 'running' if current date is between start_date and end_date
  -- Exclude draft classes from being updated
  UPDATE classes 
  SET status = 'running'::class_status, updated_at = now()
  WHERE status != 'draft'::class_status
    AND status IN ('active'::class_status, 'inactive'::class_status)
    AND EXISTS (
      SELECT 1 FROM class_schedules 
      WHERE class_schedules.class_id = classes.id 
      AND class_schedules.start_date IS NOT NULL
      AND class_schedules.end_date IS NOT NULL
      AND CURRENT_DATE >= class_schedules.start_date
      AND CURRENT_DATE <= class_schedules.end_date
    );

  -- Update classes to 'completed' if current date is after end_date
  -- Exclude draft classes from being updated
  UPDATE classes 
  SET status = 'completed'::class_status, updated_at = now()
  WHERE status != 'draft'::class_status
    AND status IN ('active'::class_status, 'running'::class_status)
    AND EXISTS (
      SELECT 1 FROM class_schedules 
      WHERE class_schedules.class_id = classes.id 
      AND class_schedules.end_date IS NOT NULL
      AND CURRENT_DATE > class_schedules.end_date
    );

  -- Log the update
  RAISE LOG 'Class statuses updated at % (draft classes excluded)', now();
END;
$$;
