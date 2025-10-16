-- Phase 2 & 3: Add student engagement and tracking tables

-- Add enrollment tracking columns to student_enrollments
ALTER TABLE public.student_enrollments 
ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_sessions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_sessions INTEGER;

-- Create recently viewed classes table for recommendations
CREATE TABLE IF NOT EXISTS public.recently_viewed_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, class_id)
);

-- Enable RLS on recently_viewed_classes
ALTER TABLE public.recently_viewed_classes ENABLE ROW LEVEL SECURITY;

-- RLS policies for recently_viewed_classes
CREATE POLICY "Users can view their own recently viewed classes"
ON public.recently_viewed_classes
FOR SELECT
USING (student_id = auth.uid());

CREATE POLICY "Users can insert their own recently viewed classes"
ON public.recently_viewed_classes
FOR INSERT
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can update their own recently viewed classes"
ON public.recently_viewed_classes
FOR UPDATE
USING (student_id = auth.uid());

CREATE POLICY "Users can delete their own recently viewed classes"
ON public.recently_viewed_classes
FOR DELETE
USING (student_id = auth.uid());

-- Create class recommendations table
CREATE TABLE IF NOT EXISTS public.class_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  recommendation_score DECIMAL DEFAULT 0,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, class_id)
);

-- Enable RLS on class_recommendations
ALTER TABLE public.class_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS policies for class_recommendations
CREATE POLICY "Users can view their own recommendations"
ON public.class_recommendations
FOR SELECT
USING (student_id = auth.uid());

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recently_viewed_student ON public.recently_viewed_classes(student_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_student ON public.class_recommendations(student_id, recommendation_score DESC);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.student_enrollments(student_id, status);

-- Add trigger to update updated_at on class_recommendations
CREATE TRIGGER update_class_recommendations_updated_at
BEFORE UPDATE ON public.class_recommendations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();