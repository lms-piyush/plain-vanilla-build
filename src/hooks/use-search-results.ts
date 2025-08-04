import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'class' | 'tutor';
  tutorName?: string;
  tutorId?: string;
  subject?: string;
  rating?: number;
  totalReviews?: number;
}

export const useSearchResults = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchClassesAndTutors = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Search classes
      const { data: classes, error: classError } = await supabase
        .from('classes')
        .select(`
          id,
          title,
          description,
          subject,
          tutor_id,
          profiles!classes_tutor_id_fkey (
            full_name
          )
        `)
        .eq('status', 'active')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,subject.ilike.%${query}%`)
        .limit(3);

      if (classError) throw classError;

      // Search tutors
      const { data: tutors, error: tutorError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          bio,
          position
        `)
        .eq('role', 'tutor')
        .or(`full_name.ilike.%${query}%,bio.ilike.%${query}%,position.ilike.%${query}%`)
        .limit(2);

      if (tutorError) throw tutorError;

      // Format results
      const classResults: SearchResult[] = (classes || []).map(cls => ({
        id: cls.id,
        title: cls.title,
        description: cls.description || '',
        type: 'class' as const,
        tutorName: cls.profiles?.full_name || 'Unknown Tutor',
        tutorId: cls.tutor_id,
        subject: cls.subject
      }));

      const tutorResults: SearchResult[] = (tutors || []).map(tutor => ({
        id: tutor.id,
        title: tutor.full_name,
        description: tutor.bio || tutor.position || '',
        type: 'tutor' as const
      }));

      // Combine and limit to 5 total results
      const combinedResults = [...classResults, ...tutorResults].slice(0, 5);
      setResults(combinedResults);

    } catch (err: any) {
      setError(err.message);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    results,
    isLoading,
    error,
    searchClassesAndTutors
  };
};