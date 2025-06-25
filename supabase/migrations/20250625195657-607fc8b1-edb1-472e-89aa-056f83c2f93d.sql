
-- Update the check constraint for lesson_materials to include all material types used in the application
ALTER TABLE lesson_materials DROP CONSTRAINT IF EXISTS lesson_materials_material_type_check;

ALTER TABLE lesson_materials ADD CONSTRAINT lesson_materials_material_type_check 
CHECK (material_type IN ('document', 'video', 'presentation', 'worksheet', 'link', 'image', 'audio', 'pdf', 'spreadsheet'));
