-- Enhanced subscription system for class enrollment
-- Update existing subscribers table to support detailed subscription tracking
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS subscription_price_id TEXT;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS subscription_id TEXT;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMPTZ;
ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;

-- Create subscription_history table to track all subscription payments
CREATE TABLE IF NOT EXISTS public.subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subscription_id TEXT NOT NULL,
  stripe_invoice_id TEXT,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL, -- paid, failed, pending
  billing_period_start TIMESTAMPTZ NOT NULL,
  billing_period_end TIMESTAMPTZ NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on subscription_history
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

-- Create policies for subscription_history
CREATE POLICY "Users can view their own subscription history" 
ON public.subscription_history
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Service can insert subscription history" 
ON public.subscription_history
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service can update subscription history" 
ON public.subscription_history
FOR UPDATE 
USING (true);

-- Create subscription_plans table for managing available plans
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  stripe_price_id TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  interval_type TEXT NOT NULL, -- month, year
  features TEXT[], -- Array of features
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on subscription_plans
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active subscription plans
CREATE POLICY "Anyone can view active subscription plans" 
ON public.subscription_plans
FOR SELECT 
USING (is_active = true);

-- Update classes table to support subscription model
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS pricing_model TEXT DEFAULT 'one_time'; -- one_time, subscription, both
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS required_subscription_tier TEXT; -- basic, premium, enterprise

-- Update student_enrollments to track subscription enrollments
ALTER TABLE public.student_enrollments ADD COLUMN IF NOT EXISTS enrollment_type TEXT DEFAULT 'one_time'; -- one_time, subscription
ALTER TABLE public.student_enrollments ADD COLUMN IF NOT EXISTS subscription_id TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON public.subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_subscription_id ON public.subscription_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_classes_pricing_model ON public.classes(pricing_model);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_subscription_id ON public.student_enrollments(subscription_id);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, stripe_price_id, amount, interval_type, features) VALUES
('Basic', 'Access to basic classes and features', 'price_basic_monthly', 999, 'month', ARRAY['Access to basic classes', 'Email support', 'Mobile app access']),
('Premium', 'Access to premium classes and advanced features', 'price_premium_monthly', 1999, 'month', ARRAY['Access to all classes', 'Priority support', 'Advanced analytics', 'Downloadable materials']),
('Enterprise', 'Full access with personalized tutoring', 'price_enterprise_monthly', 4999, 'month', ARRAY['Unlimited class access', '1-on-1 tutoring sessions', 'Custom learning paths', 'Dedicated support manager'])
ON CONFLICT (stripe_price_id) DO NOTHING;