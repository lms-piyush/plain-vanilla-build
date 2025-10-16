-- Populate missing data in classes table with sensible defaults

-- Update age_range_min and age_range_max for classes that don't have them
UPDATE classes 
SET 
  age_range_min = CASE 
    WHEN age_range_min IS NULL THEN 8
    ELSE age_range_min
  END,
  age_range_max = CASE 
    WHEN age_range_max IS NULL THEN 16
    ELSE age_range_max
  END
WHERE age_range_min IS NULL OR age_range_max IS NULL;

-- Update duration_minutes for classes that don't have it
UPDATE classes 
SET duration_minutes = CASE 
  WHEN duration_type = 'recurring' THEN 60
  WHEN duration_type = 'one-time' THEN 90
  ELSE 60
END
WHERE duration_minutes IS NULL;

-- Update class_type for classes that don't have it
UPDATE classes 
SET class_type = CASE 
  WHEN class_format = 'live' THEN 'interactive'
  WHEN class_format = 'recorded' THEN 'self-paced'
  ELSE 'interactive'
END
WHERE class_type IS NULL;

-- Update schedule_type for classes that don't have it
UPDATE classes 
SET schedule_type = CASE 
  WHEN duration_type = 'recurring' THEN 'weekly'
  WHEN duration_type = 'one-time' THEN 'flexible'
  ELSE 'weekly'
END
WHERE schedule_type IS NULL;