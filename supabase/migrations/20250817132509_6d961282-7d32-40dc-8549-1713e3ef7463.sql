-- Ensure ON CONFLICT (user_id) works on subscribers
ALTER TABLE public.subscribers
ADD CONSTRAINT subscribers_user_id_key UNIQUE (user_id);