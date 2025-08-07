-- Create payment_enrollments table to track payments and enrollments
CREATE TABLE public.payment_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  class_id UUID NOT NULL,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'inr',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed
  enrollment_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_enrollments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own payment enrollments" 
ON public.payment_enrollments 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Service can manage all payment enrollments" 
ON public.payment_enrollments 
FOR ALL 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_payment_enrollments_updated_at
BEFORE UPDATE ON public.payment_enrollments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();