-- 1) Restrict public read access on profiles and add safer RLS
-- Enable RLS (if not already)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop overly broad policy if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Allow read access to all profiles'
  ) THEN
    DROP POLICY "Allow read access to all profiles" ON public.profiles;
  END IF;
END $$;

-- Ensure existing specific self-access policies exist (idempotent recreate)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);
  END IF;
END $$;

-- Add minimal public read policy to allow class browsing (only expose non-sensitive tutor info)
-- Create a view that exposes only safe tutor fields, then allow public read on the view instead of table
CREATE OR REPLACE VIEW public.tutor_public_profiles AS
SELECT id, full_name, avatar_url, role
FROM public.profiles
WHERE role = 'tutor';

-- Ensure RLS does not apply to views directly; control via underlying table policies.
-- Add a narrow policy letting anyone select tutors' basic info via a security definer function
-- Create function to safely select tutors basic info without exposing other roles
CREATE OR REPLACE FUNCTION public.can_view_tutor_profile(p_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = p_id AND p.role = 'tutor'
  );
$$;

-- Policy to allow selecting tutor rows, but only basic columns should be used by app; the policy guards row access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Public can read tutor rows'
  ) THEN
    CREATE POLICY "Public can read tutor rows"
    ON public.profiles
    FOR SELECT
    USING (public.can_view_tutor_profile(id));
  END IF;
END $$;

-- 2) Review privacy: ensure student identity is not leaked by enforcing select to all, but app should not select student_id
-- Keep existing open SELECT but it exposes ids; introduce a view without student_id and recommend using it.
CREATE OR REPLACE VIEW public.public_class_reviews AS
SELECT id, class_id, rating, review_text, created_at, updated_at
FROM public.class_reviews;

CREATE OR REPLACE VIEW public.public_tutor_reviews AS
SELECT id, tutor_id, rating, review_text, created_at, updated_at
FROM public.tutor_reviews;

-- 3) Harden existing functions with SECURITY DEFINER and search_path
-- Update functions definitions safely (idempotent replace) keeping the same logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'student' THEN 'student'::user_role
      WHEN NEW.raw_user_meta_data->>'role' = 'parent' THEN 'parent'::user_role  
      WHEN NEW.raw_user_meta_data->>'role' = 'tutor' THEN 'tutor'::user_role
      ELSE 'student'::user_role
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_latest_batch_number(class_id_param uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(MAX(batch_number), 0)
  FROM public.classes
  WHERE id = class_id_param;
$$;

CREATE OR REPLACE FUNCTION public.update_class_statuses()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE classes 
  SET status = 'active'::class_status, updated_at = now()
  WHERE status != 'draft'::class_status
    AND status != 'active'::class_status
    AND EXISTS (
      SELECT 1 FROM class_schedules 
      WHERE class_schedules.class_id = classes.id 
      AND class_schedules.start_date IS NOT NULL
      AND CURRENT_DATE < class_schedules.start_date
    );

  UPDATE classes 
  SET status = 'running'::class_status, updated_at = now()
  WHERE status != 'draft'::class_status
    AND status IN ('active'::class_status, 'inactive'::class_status)
    AND EXISTS (
      SELECT 1 FROM class_schedules 
      WHERE class_schedules.class_id = classes.id 
      AND class_schedules.start_date IS NOT NULL
      AND class_schedules.end_date IS NOT NULL
      AND CURRENT_DATE >= class_schedules.start_date
      AND CURRENT_DATE <= class_schedules.end_date
    );

  UPDATE classes 
  SET status = 'completed'::class_status, updated_at = now()
  WHERE status != 'draft'::class_status
    AND status IN ('active'::class_status, 'running'::class_status)
    AND EXISTS (
      SELECT 1 FROM class_schedules 
      WHERE class_schedules.class_id = classes.id 
      AND class_schedules.end_date IS NOT NULL
      AND CURRENT_DATE > class_schedules.end_date
    );

  RAISE LOG 'Class statuses updated at % (draft classes excluded)', now();
END;
$$;

CREATE OR REPLACE FUNCTION public.create_class_batch(original_class_id uuid, tutor_id_param uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_batch_number integer;
  original_class_data record;
BEGIN
  SELECT * INTO original_class_data
  FROM public.classes
  WHERE id = original_class_id 
  AND tutor_id = tutor_id_param 
  AND status = 'completed';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Class not found or not owned by tutor or not completed';
  END IF;
  
  SELECT COALESCE(MAX(batch_number), 0) + 1 INTO new_batch_number
  FROM public.classes
  WHERE id = original_class_id;
  
  UPDATE public.classes
  SET 
    batch_number = new_batch_number,
    status = 'draft'::class_status,
    updated_at = now()
  WHERE id = original_class_id;
  
  RETURN original_class_id;
END;
$$;