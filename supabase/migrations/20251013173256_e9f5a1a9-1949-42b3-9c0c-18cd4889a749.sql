-- Create tutor_bank_accounts table
CREATE TABLE IF NOT EXISTS public.tutor_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL,
  account_holder_name TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  routing_number TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('checking', 'savings')),
  is_primary BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tutor_bank_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tutor_bank_accounts
CREATE POLICY "Tutors can view their own bank accounts"
  ON public.tutor_bank_accounts
  FOR SELECT
  USING (
    tutor_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'tutor'
    )
  );

CREATE POLICY "Tutors can insert their own bank accounts"
  ON public.tutor_bank_accounts
  FOR INSERT
  WITH CHECK (
    tutor_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'tutor'
    )
  );

CREATE POLICY "Tutors can update their own bank accounts"
  ON public.tutor_bank_accounts
  FOR UPDATE
  USING (
    tutor_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'tutor'
    )
  );

CREATE POLICY "Tutors can delete their own bank accounts"
  ON public.tutor_bank_accounts
  FOR DELETE
  USING (
    tutor_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'tutor'
    )
  );

-- Create withdrawal_requests table
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL,
  bank_account_id UUID REFERENCES public.tutor_bank_accounts(id),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected', 'cancelled')),
  requested_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  admin_notes TEXT,
  transaction_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for withdrawal_requests
CREATE POLICY "Tutors can view their own withdrawal requests"
  ON public.withdrawal_requests
  FOR SELECT
  USING (
    tutor_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'tutor'
    )
  );

CREATE POLICY "Tutors can insert their own withdrawal requests"
  ON public.withdrawal_requests
  FOR INSERT
  WITH CHECK (
    tutor_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'tutor'
    )
  );

CREATE POLICY "Tutors can update their own pending withdrawal requests"
  ON public.withdrawal_requests
  FOR UPDATE
  USING (
    tutor_id = auth.uid() AND 
    status = 'pending' AND
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'tutor'
    )
  );

CREATE POLICY "Admins can view all withdrawal requests"
  ON public.withdrawal_requests
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all withdrawal requests"
  ON public.withdrawal_requests
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Create tutor_earnings table
CREATE TABLE IF NOT EXISTS public.tutor_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL,
  class_id UUID REFERENCES public.classes(id),
  enrollment_id UUID REFERENCES public.student_enrollments(id),
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  currency TEXT DEFAULT 'USD',
  platform_fee NUMERIC DEFAULT 0 CHECK (platform_fee >= 0),
  net_amount NUMERIC NOT NULL CHECK (net_amount >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'available', 'withdrawn', 'refunded')),
  earned_at TIMESTAMPTZ DEFAULT now(),
  available_at TIMESTAMPTZ,
  withdrawn_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tutor_earnings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tutor_earnings
CREATE POLICY "Tutors can view their own earnings"
  ON public.tutor_earnings
  FOR SELECT
  USING (
    tutor_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'tutor'
    )
  );

CREATE POLICY "Admins can view all earnings"
  ON public.tutor_earnings
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all earnings"
  ON public.tutor_earnings
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_tutor_bank_accounts_updated_at
  BEFORE UPDATE ON public.tutor_bank_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_withdrawal_requests_updated_at
  BEFORE UPDATE ON public.withdrawal_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tutor_earnings_updated_at
  BEFORE UPDATE ON public.tutor_earnings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();