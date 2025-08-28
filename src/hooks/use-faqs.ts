import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface FAQ {
  id: string;
  title: string;
  description: string;
  category: 'general' | 'classes' | 'billing';
  created_at: string;
  updated_at: string;
}

export const useFAQs = (category?: 'general' | 'classes' | 'billing') => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFAQs = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: true });

      // Apply category filter at database level if specified
      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast({
        title: "Error",
        description: "Failed to load FAQs",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [category]);

  return {
    faqs,
    isLoading,
    refetch: fetchFAQs
  };
};