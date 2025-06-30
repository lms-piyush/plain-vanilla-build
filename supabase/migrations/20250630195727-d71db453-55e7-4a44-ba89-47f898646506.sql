
-- Add foreign key constraint to link class_reviews.student_id to profiles.id
ALTER TABLE public.class_reviews 
ADD CONSTRAINT fk_class_reviews_student_id 
FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key constraint to link class_reviews.class_id to classes.id  
ALTER TABLE public.class_reviews 
ADD CONSTRAINT fk_class_reviews_class_id 
FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;
