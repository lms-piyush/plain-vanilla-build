-- Add notification tracking table to prevent duplicate session reminders
CREATE TABLE IF NOT EXISTS public.notification_tracking (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid NOT NULL,
  notification_type text NOT NULL,
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(session_id, notification_type)
);

-- Enable RLS on notification_tracking
ALTER TABLE public.notification_tracking ENABLE ROW LEVEL SECURITY;

-- Create policy for tutors to manage their session notifications
CREATE POLICY "Tutors can manage their session notifications" 
ON public.notification_tracking 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM class_syllabus cs
    JOIN classes c ON cs.class_id = c.id
    WHERE cs.id = notification_tracking.session_id 
    AND c.tutor_id = auth.uid()
  )
);

-- Create policy for service role to insert notifications
CREATE POLICY "Service role can insert notifications" 
ON public.notification_tracking 
FOR INSERT 
WITH CHECK (true);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_notification_tracking_session_type 
ON public.notification_tracking (session_id, notification_type);