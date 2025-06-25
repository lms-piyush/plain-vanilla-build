
-- Create storage bucket for class materials
INSERT INTO storage.buckets (id, name, public) 
VALUES ('class-materials', 'class-materials', true);

-- Create storage policies for class materials bucket
CREATE POLICY "Users can upload class materials" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'class-materials');

CREATE POLICY "Users can view class materials" ON storage.objects
FOR SELECT USING (bucket_id = 'class-materials');

CREATE POLICY "Users can update their class materials" ON storage.objects
FOR UPDATE USING (bucket_id = 'class-materials');

CREATE POLICY "Users can delete their class materials" ON storage.objects
FOR DELETE USING (bucket_id = 'class-materials');

-- Add file_path column to lesson_materials table to store uploaded file paths
ALTER TABLE lesson_materials ADD COLUMN file_path TEXT;

-- Add additional session fields for better management
ALTER TABLE class_syllabus ADD COLUMN session_date DATE;
ALTER TABLE class_syllabus ADD COLUMN start_time TIME;
ALTER TABLE class_syllabus ADD COLUMN end_time TIME;
ALTER TABLE class_syllabus ADD COLUMN status TEXT DEFAULT 'upcoming' CHECK (status IN ('completed', 'upcoming', 'cancelled'));
ALTER TABLE class_syllabus ADD COLUMN attendance TEXT CHECK (attendance IN ('present', 'absent'));
ALTER TABLE class_syllabus ADD COLUMN notes TEXT;

-- Add additional material fields for tracking
ALTER TABLE lesson_materials ADD COLUMN file_size BIGINT;
ALTER TABLE lesson_materials ADD COLUMN upload_date TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE lesson_materials ADD COLUMN download_count INTEGER DEFAULT 0;
