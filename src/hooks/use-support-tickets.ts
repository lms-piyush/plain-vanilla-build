import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'in-progress' | 'resolved';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useSupportTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchTickets = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Error",
        description: "Failed to load support tickets",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTicket = async (title: string, description: string) => {
    if (!user) return false;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('tickets')
        .insert({
          title,
          description,
          created_by: user.id
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Support ticket submitted successfully"
      });
      
      // Refresh the tickets list
      await fetchTickets();
      return true;
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to submit support ticket",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  return {
    tickets,
    isLoading,
    isSubmitting,
    createTicket,
    refetch: fetchTickets
  };
};