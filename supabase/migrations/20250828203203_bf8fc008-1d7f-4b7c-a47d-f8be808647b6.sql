-- Create ticket status enum
CREATE TYPE ticket_status AS ENUM ('in-progress', 'resolved');

-- Create FAQ category enum
CREATE TYPE faq_category AS ENUM ('general', 'classes', 'billing');

-- Create tickets table
CREATE TABLE public.tickets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status ticket_status NOT NULL DEFAULT 'in-progress',
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create FAQs table
CREATE TABLE public.faqs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category faq_category NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tickets
CREATE POLICY "Users can create their own tickets" 
ON public.tickets 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view their own tickets" 
ON public.tickets 
FOR SELECT 
USING (auth.uid() = created_by);

CREATE POLICY "Users can update their own tickets" 
ON public.tickets 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Create RLS policies for FAQs (public read access)
CREATE POLICY "Anyone can view FAQs" 
ON public.faqs 
FOR SELECT 
USING (true);

-- Create trigger for tickets updated_at
CREATE TRIGGER update_tickets_updated_at
BEFORE UPDATE ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for FAQs updated_at  
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed FAQ data
INSERT INTO public.faqs (title, description, category) VALUES 
-- General category
('How do I enroll in a class?', 'To enroll in a class, navigate to the Explore Classes page and select the class you''re interested in. Click the Enroll button and follow the payment instructions to complete your enrollment.', 'general'),
('What payment methods are accepted?', 'We accept credit/debit cards, UPI, and netbanking. You can manage your payment methods in your Profile page under the Payment Method section.', 'general'),
('How do I reset my password?', 'Click on the "Forgot Password" link on the login page and enter your email address. We''ll send you instructions to reset your password.', 'general'),
('Can I change my profile information?', 'Yes, you can update your profile information by visiting the Profile page in your dashboard.', 'general'),

-- Classes category
('How do I join an online class?', 'You can join an online class from your Dashboard or My Classes page. Click on the "Start Session" button when it becomes available (usually 1 minute before the scheduled time).', 'classes'),
('What''s the difference between inbound and outbound offline classes?', 'Inbound classes take place at the tutor''s location, and you''ll need to travel there. Outbound classes take place at your location, and the tutor will travel to you.', 'classes'),
('Can I reschedule a class?', 'You can reschedule a class by contacting your tutor directly through the messaging system or by submitting a support ticket.', 'classes'),
('What happens if I miss a class?', 'If you miss a class, you can contact your tutor to discuss makeup options or access recorded sessions if available.', 'classes'),

-- Billing category
('Can I get a refund if I''m not satisfied with a class?', 'Yes, we offer a 7-day satisfaction guarantee. If you''re not satisfied with a class, you can request a refund within 7 days of enrollment.', 'billing'),
('How do I update my billing information?', 'You can update your billing information in your Profile page under the Payment Method section.', 'billing'),
('When will I be charged for a subscription?', 'Subscription charges are processed on the date you signed up and then monthly on the same date each month.', 'billing'),
('How can I view my payment history?', 'You can view your complete payment history in the Billing section of your Profile page.', 'billing');