
-- Create reviews table for class reviews and ratings
CREATE TABLE public.class_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL,
  student_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(class_id, student_id) -- Prevent duplicate reviews from same student
);

-- Add Row Level Security (RLS)
ALTER TABLE public.class_reviews ENABLE ROW LEVEL SECURITY;

-- Policy for students to view all reviews for classes they can access
CREATE POLICY "Students can view class reviews" 
  ON public.class_reviews 
  FOR SELECT 
  USING (true);

-- Policy for students to create reviews for classes they're enrolled in
CREATE POLICY "Students can create reviews for enrolled classes" 
  ON public.class_reviews 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = student_id AND
    EXISTS (
      SELECT 1 FROM student_enrollments 
      WHERE student_id = auth.uid() 
      AND class_id = class_reviews.class_id 
      AND status = 'active'
    )
  );

-- Policy for students to update their own reviews
CREATE POLICY "Students can update their own reviews" 
  ON public.class_reviews 
  FOR UPDATE 
  USING (auth.uid() = student_id);

-- Policy for students to delete their own reviews
CREATE POLICY "Students can delete their own reviews" 
  ON public.class_reviews 
  FOR DELETE 
  USING (auth.uid() = student_id);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_class_reviews_updated_at
  BEFORE UPDATE ON public.class_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_class_reviews_class_id ON public.class_reviews(class_id);
CREATE INDEX idx_class_reviews_created_at ON public.class_reviews(created_at DESC);
