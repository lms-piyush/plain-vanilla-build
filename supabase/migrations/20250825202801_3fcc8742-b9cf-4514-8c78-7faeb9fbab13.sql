-- Add missing foreign keys for conversations to profiles
ALTER TABLE public.conversations
  ADD CONSTRAINT conversations_student_id_fkey
    FOREIGN KEY (student_id)
    REFERENCES public.profiles(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;

ALTER TABLE public.conversations
  ADD CONSTRAINT conversations_tutor_id_fkey
    FOREIGN KEY (tutor_id)
    REFERENCES public.profiles(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE;

-- Allow tutors to view student profiles for their conversations
CREATE POLICY "Tutors can view student profiles for their conversations"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.student_id = profiles.id
      AND c.tutor_id = auth.uid()
  )
);
