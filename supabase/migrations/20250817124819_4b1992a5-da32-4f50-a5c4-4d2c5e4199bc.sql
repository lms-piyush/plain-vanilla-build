-- Update the Basic subscription plan to use the provided Stripe product ID
UPDATE subscription_plans 
SET stripe_price_id = 'prod_SsrWQE79rOeyEQ'
WHERE name = 'Basic';

-- For now, let's create placeholder product IDs for Premium and Enterprise
-- You'll need to replace these with actual Stripe product/price IDs later
UPDATE subscription_plans 
SET stripe_price_id = 'prod_placeholder_premium'
WHERE name = 'Premium';

UPDATE subscription_plans 
SET stripe_price_id = 'prod_placeholder_enterprise'
WHERE name = 'Enterprise';