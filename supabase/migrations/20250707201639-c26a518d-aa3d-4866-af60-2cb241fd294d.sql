-- Create tutor_reviews table for separate tutor reviews
CREATE TABLE public.tutor_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID NOT NULL,
  student_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tutor_id, student_id) -- Prevent duplicate reviews from same student for same tutor
);

-- Add Row Level Security (RLS)
ALTER TABLE public.tutor_reviews ENABLE ROW LEVEL SECURITY;

-- Add foreign key constraints
ALTER TABLE public.tutor_reviews 
ADD CONSTRAINT fk_tutor_reviews_tutor_id 
FOREIGN KEY (tutor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.tutor_reviews 
ADD CONSTRAINT fk_tutor_reviews_student_id 
FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Policy for students to view all tutor reviews
CREATE POLICY "Students can view tutor reviews" 
  ON public.tutor_reviews 
  FOR SELECT 
  USING (true);

-- Policy for students to create reviews for tutors they have classes with
CREATE POLICY "Students can create reviews for tutors" 
  ON public.tutor_reviews 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = student_id AND
    EXISTS (
      SELECT 1 FROM student_enrollments se
      JOIN classes c ON c.id = se.class_id
      WHERE se.student_id = auth.uid() 
      AND c.tutor_id = tutor_reviews.tutor_id 
      AND se.status = 'active'
    )
  );

-- Policy for students to update their own reviews
CREATE POLICY "Students can update their own tutor reviews" 
  ON public.tutor_reviews 
  FOR UPDATE 
  USING (auth.uid() = student_id);

-- Policy for students to delete their own reviews
CREATE POLICY "Students can delete their own tutor reviews" 
  ON public.tutor_reviews 
  FOR DELETE 
  USING (auth.uid() = student_id);

-- Policy for tutors to view their own reviews
CREATE POLICY "Tutors can view their own reviews" 
  ON public.tutor_reviews 
  FOR SELECT 
  USING (auth.uid() = tutor_id);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_tutor_reviews_updated_at
  BEFORE UPDATE ON public.tutor_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_tutor_reviews_tutor_id ON public.tutor_reviews(tutor_id);
CREATE INDEX idx_tutor_reviews_created_at ON public.tutor_reviews(created_at DESC);