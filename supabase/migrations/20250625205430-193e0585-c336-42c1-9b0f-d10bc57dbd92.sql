
-- Add a status column to class_syllabus to track lesson completion
ALTER TABLE class_syllabus 
ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE;

-- Add an index for better performance when querying lessons by class
CREATE INDEX IF NOT EXISTS idx_class_syllabus_class_id ON class_syllabus(class_id);

-- Add an index for better performance when querying materials by lesson
CREATE INDEX IF NOT EXISTS idx_lesson_materials_lesson_id ON lesson_materials(lesson_id);

-- Update the lesson_materials table to ensure proper relationships
-- Add a constraint to ensure lesson_id references class_syllabus.id
ALTER TABLE lesson_materials 
ADD CONSTRAINT fk_lesson_materials_lesson_id 
FOREIGN KEY (lesson_id) REFERENCES class_syllabus(id) 
ON DELETE CASCADE;
