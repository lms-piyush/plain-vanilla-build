-- Create missing profile for pranav@11point2.in
INSERT INTO profiles (id, full_name, role)
SELECT id, 'Pranav', 'tutor'
FROM auth.users
WHERE email = 'pranav@11point2.in'
ON CONFLICT (id) DO NOTHING;