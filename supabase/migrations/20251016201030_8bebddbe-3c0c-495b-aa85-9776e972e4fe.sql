-- Add enrolled_by_parent_id to track which parent enrolled which child
ALTER TABLE student_enrollments 
ADD COLUMN IF NOT EXISTS enrolled_by_parent_id UUID REFERENCES auth.users(id);

-- Create parent_preferences table
CREATE TABLE IF NOT EXISTS parent_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  class_reminders BOOLEAN DEFAULT true,
  progress_reports BOOLEAN DEFAULT true,
  spending_limit_per_child DECIMAL DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_id)
);

-- Enable RLS
ALTER TABLE parent_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for parent_preferences
CREATE POLICY "Parents can view their own preferences" 
ON parent_preferences FOR SELECT 
USING (parent_id = auth.uid());

CREATE POLICY "Parents can insert their own preferences" 
ON parent_preferences FOR INSERT 
WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Parents can update their own preferences" 
ON parent_preferences FOR UPDATE 
USING (parent_id = auth.uid());

CREATE POLICY "Parents can delete their own preferences" 
ON parent_preferences FOR DELETE 
USING (parent_id = auth.uid());

-- Create parent_notifications table
CREATE TABLE IF NOT EXISTS parent_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('class_reminder', 'progress_update', 'payment_due', 'enrollment_confirmation', 'session_completed')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE parent_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for parent_notifications
CREATE POLICY "Parents can view their own notifications" 
ON parent_notifications FOR SELECT 
USING (parent_id = auth.uid());

CREATE POLICY "Parents can update their own notifications" 
ON parent_notifications FOR UPDATE 
USING (parent_id = auth.uid());

CREATE POLICY "Parents can delete their own notifications" 
ON parent_notifications FOR DELETE 
USING (parent_id = auth.uid());

-- Create triggers for updated_at
CREATE TRIGGER update_parent_preferences_updated_at
BEFORE UPDATE ON parent_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parent_notifications_updated_at
BEFORE UPDATE ON parent_notifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_parent_notifications_parent_id ON parent_notifications(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_notifications_child_id ON parent_notifications(child_id);
CREATE INDEX IF NOT EXISTS idx_parent_notifications_is_read ON parent_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_enrolled_by_parent ON student_enrollments(enrolled_by_parent_id);