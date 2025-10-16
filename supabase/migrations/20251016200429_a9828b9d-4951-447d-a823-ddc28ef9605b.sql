-- Add onboarding tracking to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0;

-- Create tutor_preferences table for session reminders and settings
CREATE TABLE IF NOT EXISTS tutor_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  send_session_reminders BOOLEAN DEFAULT true,
  reminder_hours_before INTEGER DEFAULT 24,
  auto_rate_students BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tutor_id)
);

-- Enable RLS
ALTER TABLE tutor_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tutor_preferences
CREATE POLICY "Tutors can view their own preferences" 
ON tutor_preferences FOR SELECT 
USING (tutor_id = auth.uid());

CREATE POLICY "Tutors can insert their own preferences" 
ON tutor_preferences FOR INSERT 
WITH CHECK (tutor_id = auth.uid());

CREATE POLICY "Tutors can update their own preferences" 
ON tutor_preferences FOR UPDATE 
USING (tutor_id = auth.uid());

CREATE POLICY "Tutors can delete their own preferences" 
ON tutor_preferences FOR DELETE 
USING (tutor_id = auth.uid());

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_tutor_preferences_updated_at
BEFORE UPDATE ON tutor_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();