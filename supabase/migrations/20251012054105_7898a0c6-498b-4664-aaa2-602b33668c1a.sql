-- Fix the security warnings by ensuring search_path is set for all functions
-- Re-create update_updated_at_column function with proper search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate all triggers that were dropped
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_class_syllabus_updated_at
  BEFORE UPDATE ON public.class_syllabus
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_enrollments_updated_at
  BEFORE UPDATE ON public.student_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_class_reviews_updated_at
  BEFORE UPDATE ON public.class_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();