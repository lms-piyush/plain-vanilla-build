-- Create video_tutorials table
CREATE TABLE public.video_tutorials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.video_tutorials ENABLE ROW LEVEL SECURITY;

-- Create policy for public viewing of active tutorials
CREATE POLICY "Anyone can view active video tutorials" 
ON public.video_tutorials 
FOR SELECT 
USING (is_active = true);

-- Create policy for creators to manage their tutorials
CREATE POLICY "Users can manage their own video tutorials" 
ON public.video_tutorials 
FOR ALL 
USING (created_by = auth.uid());

-- Insert seed data for video tutorials
INSERT INTO public.video_tutorials (title, description, url, thumbnail_url, created_by, is_active) VALUES
  ('Getting Started Guide', 'Quick walkthrough of platform basics and how to navigate your dashboard', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', (SELECT id FROM public.profiles WHERE role = 'tutor' LIMIT 1), true),
  ('How to Join a Class', 'Step-by-step instructions on enrolling and joining your first class', 'https://www.youtube.com/watch?v=oHg5SJYRHA0', 'https://img.youtube.com/vi/oHg5SJYRHA0/maxresdefault.jpg', (SELECT id FROM public.profiles WHERE role = 'tutor' LIMIT 1), true),
  ('Billing Explained', 'Complete guide to payments, subscriptions, and billing management', 'https://www.youtube.com/watch?v=iik25wqIuFo', 'https://img.youtube.com/vi/iik25wqIuFo/maxresdefault.jpg', (SELECT id FROM public.profiles WHERE role = 'tutor' LIMIT 1), true),
  ('Track Your Progress', 'Learn how to monitor your learning journey and achievements', 'https://www.youtube.com/watch?v=ZZ5LpwO-An4', 'https://img.youtube.com/vi/ZZ5LpwO-An4/maxresdefault.jpg', (SELECT id FROM public.profiles WHERE role = 'tutor' LIMIT 1), true),
  ('Contact Support', 'How to get help when you need it and use our support system', 'https://www.youtube.com/watch?v=HEXWRTEbj1I', 'https://img.youtube.com/vi/HEXWRTEbj1I/maxresdefault.jpg', (SELECT id FROM public.profiles WHERE role = 'tutor' LIMIT 1), true);