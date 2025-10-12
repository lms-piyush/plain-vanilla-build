-- Force-recreate FK on classes.tutor_id to profiles
ALTER TABLE public.classes DROP CONSTRAINT IF EXISTS classes_tutor_id_fkey;
ALTER TABLE public.classes
  ADD CONSTRAINT classes_tutor_id_fkey
  FOREIGN KEY (tutor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;