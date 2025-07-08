-- Add tutor-specific profile fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS years_experience INTEGER,
ADD COLUMN IF NOT EXISTS languages_spoken TEXT[];

-- Create index for better performance on tutor queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);