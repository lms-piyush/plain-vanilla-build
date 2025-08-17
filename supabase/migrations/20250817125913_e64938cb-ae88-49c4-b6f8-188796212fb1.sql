-- Add new columns to support dynamic subscription pricing
ALTER TABLE classes 
ADD COLUMN IF NOT EXISTS monthly_charges DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS subscription_multiplier DECIMAL(5,2) DEFAULT 1.0;

-- Create table to track dynamic subscription sessions
CREATE TABLE IF NOT EXISTS subscription_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  class_id UUID NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  calculated_amount INTEGER NOT NULL, -- Amount in cents
  base_amount INTEGER NOT NULL, -- Base subscription amount
  class_count INTEGER NOT NULL DEFAULT 1,
  session_type TEXT NOT NULL DEFAULT 'subscription', -- 'subscription' or 'payment'
  status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscription_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscription_sessions
CREATE POLICY "Users can view their own subscription sessions" 
ON subscription_sessions 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Service can manage subscription sessions" 
ON subscription_sessions 
FOR ALL 
USING (true);

-- Create trigger for updating timestamps
CREATE TRIGGER update_subscription_sessions_updated_at
BEFORE UPDATE ON subscription_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Update existing classes with default values
UPDATE classes 
SET monthly_charges = price 
WHERE monthly_charges IS NULL AND price IS NOT NULL;

UPDATE classes 
SET total_sessions = 4 
WHERE total_sessions IS NULL AND duration_type = 'recurring';

UPDATE classes 
SET total_sessions = 1 
WHERE total_sessions IS NULL AND duration_type = 'fixed';