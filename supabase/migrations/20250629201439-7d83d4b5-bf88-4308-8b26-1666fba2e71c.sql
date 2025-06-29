
-- Create missing RLS policies for conversations table
-- Only create policies that don't already exist

-- Policy for tutors to view conversations where they are the tutor
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversations' 
        AND policyname = 'Tutors can view their conversations'
    ) THEN
        CREATE POLICY "Tutors can view their conversations" 
          ON public.conversations 
          FOR SELECT 
          USING (tutor_id = auth.uid());
    END IF;
END $$;

-- Policy for students to view conversations where they are the student  
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversations' 
        AND policyname = 'Students can view their conversations'
    ) THEN
        CREATE POLICY "Students can view their conversations" 
          ON public.conversations 
          FOR SELECT 
          USING (student_id = auth.uid());
    END IF;
END $$;

-- Policy for tutors to create conversations where they are the tutor
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversations' 
        AND policyname = 'Tutors can create conversations'
    ) THEN
        CREATE POLICY "Tutors can create conversations" 
          ON public.conversations 
          FOR INSERT 
          WITH CHECK (tutor_id = auth.uid());
    END IF;
END $$;

-- Policy for tutors to update their conversations
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversations' 
        AND policyname = 'Tutors can update their conversations'
    ) THEN
        CREATE POLICY "Tutors can update their conversations" 
          ON public.conversations 
          FOR UPDATE 
          USING (tutor_id = auth.uid());
    END IF;
END $$;

-- Policy for students to update their conversations  
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversations' 
        AND policyname = 'Students can update their conversations'
    ) THEN
        CREATE POLICY "Students can update their conversations" 
          ON public.conversations 
          FOR UPDATE 
          USING (student_id = auth.uid());
    END IF;
END $$;
