
-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Add new status values to the existing class_status enum
ALTER TYPE class_status ADD VALUE IF NOT EXISTS 'running';

-- Create a function to update class statuses based on schedule
CREATE OR REPLACE FUNCTION update_class_statuses()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update classes to 'active' if current date is before start_date
  UPDATE classes 
  SET status = 'active'::class_status, updated_at = now()
  WHERE status = 'draft'::class_status
    AND EXISTS (
      SELECT 1 FROM class_schedules 
      WHERE class_schedules.class_id = classes.id 
      AND class_schedules.start_date IS NOT NULL
      AND CURRENT_DATE < class_schedules.start_date
    );

  -- Update classes to 'running' if current date is between start_date and end_date
  UPDATE classes 
  SET status = 'running'::class_status, updated_at = now()
  WHERE status IN ('active'::class_status, 'draft'::class_status)
    AND EXISTS (
      SELECT 1 FROM class_schedules 
      WHERE class_schedules.class_id = classes.id 
      AND class_schedules.start_date IS NOT NULL
      AND class_schedules.end_date IS NOT NULL
      AND CURRENT_DATE >= class_schedules.start_date
      AND CURRENT_DATE <= class_schedules.end_date
    );

  -- Update classes to 'completed' if current date is after end_date
  UPDATE classes 
  SET status = 'completed'::class_status, updated_at = now()
  WHERE status IN ('active'::class_status, 'running'::class_status)
    AND EXISTS (
      SELECT 1 FROM class_schedules 
      WHERE class_schedules.class_id = classes.id 
      AND class_schedules.end_date IS NOT NULL
      AND CURRENT_DATE > class_schedules.end_date
    );

  -- Log the update
  RAISE LOG 'Class statuses updated at %', now();
END;
$$;

-- Create the cron job to run daily at 12:00 AM
SELECT cron.schedule(
  'update-class-statuses-daily',
  '0 0 * * *', -- Daily at midnight
  $$
  SELECT update_class_statuses();
  $$
);
