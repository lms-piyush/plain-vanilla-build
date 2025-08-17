-- Update default currency to INR for existing tables
ALTER TABLE classes ALTER COLUMN currency SET DEFAULT 'INR';
ALTER TABLE orders ALTER COLUMN currency SET DEFAULT 'inr';
ALTER TABLE payment_enrollments ALTER COLUMN currency SET DEFAULT 'inr';
ALTER TABLE subscription_history ALTER COLUMN currency SET DEFAULT 'inr';
ALTER TABLE subscription_plans ALTER COLUMN currency SET DEFAULT 'inr';

-- Update existing USD records to INR for consistency
UPDATE classes SET currency = 'INR' WHERE currency = 'USD' OR currency IS NULL;
UPDATE orders SET currency = 'inr' WHERE currency = 'usd' OR currency IS NULL;
UPDATE payment_enrollments SET currency = 'inr' WHERE currency = 'usd' OR currency IS NULL;
UPDATE subscription_history SET currency = 'inr' WHERE currency = 'usd' OR currency IS NULL;
UPDATE subscription_plans SET currency = 'inr' WHERE currency = 'usd' OR currency IS NULL;