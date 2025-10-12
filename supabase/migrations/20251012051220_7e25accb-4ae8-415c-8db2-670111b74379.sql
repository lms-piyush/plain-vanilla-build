-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'tutor', 'student', 'parent');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  )
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Create function to get admin statistics
CREATE OR REPLACE FUNCTION public.get_admin_statistics()
RETURNS TABLE (
  total_students BIGINT,
  total_tutors BIGINT,
  total_classes BIGINT,
  active_classes BIGINT,
  total_enrollments BIGINT,
  active_enrollments BIGINT,
  total_revenue NUMERIC
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT COUNT(*) FROM profiles WHERE role = 'student'),
    (SELECT COUNT(*) FROM profiles WHERE role = 'tutor'),
    (SELECT COUNT(*) FROM classes),
    (SELECT COUNT(*) FROM classes WHERE status = 'active'),
    (SELECT COUNT(*) FROM student_enrollments),
    (SELECT COUNT(*) FROM student_enrollments WHERE status = 'active'),
    (SELECT COALESCE(SUM(price), 0) FROM classes WHERE status != 'draft');
$$;

-- Create function to get platform growth data
CREATE OR REPLACE FUNCTION public.get_platform_growth()
RETURNS TABLE (
  month DATE,
  new_students BIGINT,
  new_tutors BIGINT,
  new_classes BIGINT,
  new_enrollments BIGINT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH monthly_students AS (
    SELECT
      DATE_TRUNC('month', created_at)::DATE as month,
      COUNT(*) as count
    FROM profiles
    WHERE role = 'student' AND created_at >= NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', created_at)
  ),
  monthly_tutors AS (
    SELECT
      DATE_TRUNC('month', created_at)::DATE as month,
      COUNT(*) as count
    FROM profiles
    WHERE role = 'tutor' AND created_at >= NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', created_at)
  ),
  monthly_classes AS (
    SELECT
      DATE_TRUNC('month', created_at)::DATE as month,
      COUNT(*) as count
    FROM classes
    WHERE created_at >= NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', created_at)
  ),
  monthly_enrollments AS (
    SELECT
      DATE_TRUNC('month', created_at)::DATE as month,
      COUNT(*) as count
    FROM student_enrollments
    WHERE created_at >= NOW() - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', created_at)
  ),
  all_months AS (
    SELECT DISTINCT month FROM (
      SELECT month FROM monthly_students
      UNION SELECT month FROM monthly_tutors
      UNION SELECT month FROM monthly_classes
      UNION SELECT month FROM monthly_enrollments
    ) sub
  )
  SELECT
    m.month,
    COALESCE(s.count, 0)::BIGINT as new_students,
    COALESCE(t.count, 0)::BIGINT as new_tutors,
    COALESCE(c.count, 0)::BIGINT as new_classes,
    COALESCE(e.count, 0)::BIGINT as new_enrollments
  FROM all_months m
  LEFT JOIN monthly_students s ON m.month = s.month
  LEFT JOIN monthly_tutors t ON m.month = t.month
  LEFT JOIN monthly_classes c ON m.month = c.month
  LEFT JOIN monthly_enrollments e ON m.month = e.month
  ORDER BY m.month DESC;
$$;