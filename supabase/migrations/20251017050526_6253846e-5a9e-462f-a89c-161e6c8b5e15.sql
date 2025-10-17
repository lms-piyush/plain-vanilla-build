
-- Fix the handle_new_user trigger to properly insert into user_roles
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.email
  );
  
  -- Insert role in user_roles table (FIXED: was missing!)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student'::app_role)
  );
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Manually fix the existing user's role
INSERT INTO public.user_roles (user_id, role)
VALUES ('c1744dbf-2aa0-41d8-ac05-ce7552e9865c', 'parent'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;
