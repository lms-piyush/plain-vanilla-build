-- Add recording_url to class_syllabus for session recordings
ALTER TABLE class_syllabus ADD COLUMN IF NOT EXISTS recording_url TEXT;
ALTER TABLE class_syllabus ADD COLUMN IF NOT EXISTS recording_duration INTEGER; -- in minutes

-- Add view_count and enrollment_count to classes for analytics
ALTER TABLE classes ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS enrollment_count INTEGER DEFAULT 0;

-- Create index for better performance on recording lookups
CREATE INDEX IF NOT EXISTS idx_class_syllabus_recording 
ON class_syllabus(class_id) 
WHERE recording_url IS NOT NULL;

-- Create index for analytics queries
CREATE INDEX IF NOT EXISTS idx_classes_view_count ON classes(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_classes_enrollment_count ON classes(enrollment_count DESC);