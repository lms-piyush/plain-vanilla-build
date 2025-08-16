-- Tighten RLS on payment_enrollments to prevent public access
-- Ensure RLS is enabled
ALTER TABLE public.payment_enrollments ENABLE ROW LEVEL SECURITY;

-- Remove overly permissive policy that allowed ALL operations for any user
DROP POLICY IF EXISTS "Service can manage all payment enrollments" ON public.payment_enrollments;

-- Note: Keep existing SELECT policy restricting rows to the owning user:
--   "Users can view their own payment enrollments" (USING: user_id = auth.uid())
-- No INSERT/UPDATE/DELETE policies are added for regular users; edge functions use the service role and bypass RLS.
