-- PHASE 1: CRITICAL SECURITY FIXES

-- 1.1 Fix Profiles Table RLS - HIGHEST PRIORITY SECURITY FIX
-- Current issue: profiles table is publicly readable, exposing phone numbers and full names

-- Remove existing overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;

-- Add restricted policy: users can only view their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Allow users to view tutors' public profile info (needed for browse tutors page)
CREATE POLICY "Users can view tutor basic info"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = profiles.id
    AND user_roles.role = 'tutor'
  )
);

-- 1.2 Strengthen Tutor Applications RLS
-- Add additional validation to prevent updates to old or non-pending applications

DROP POLICY IF EXISTS "Users can update pending applications" ON tutor_applications;

CREATE POLICY "Users can update pending applications"
ON tutor_applications FOR UPDATE
USING (
  auth.uid() = user_id 
  AND status = 'pending'
  AND created_at > NOW() - INTERVAL '30 days' -- Prevent updates to old applications
);

-- Add index for better performance on tutor profile lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_tutor 
ON user_roles(user_id) 
WHERE role = 'tutor';

-- Add dismissed_profile_prompt column for future profile completion feature
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dismissed_profile_prompt BOOLEAN DEFAULT false;