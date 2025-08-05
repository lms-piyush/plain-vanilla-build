import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SavedClass {
  id: string;
  student_id: string;
  class_id: string;
  created_at: string;
}

export const useSavedClasses = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch saved classes
  const { data: savedClasses = [], isLoading, error } = useQuery({
    queryKey: ['saved-classes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('saved_classes')
        .select('*')
        .eq('student_id', user.id);

      if (error) throw error;
      return data as SavedClass[];
    },
    staleTime: 30 * 1000,
  });

  // Save class mutation
  const saveClassMutation = useMutation({
    mutationFn: async (classId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('saved_classes')
        .insert({
          student_id: user.id,
          class_id: classId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-classes'] });
      toast({
        title: 'Class saved successfully',
        description: 'The class has been added to your saved list.',
      });
    },
    onError: (error: any) => {
      console.error('Error saving class:', error);
      toast({
        title: 'Failed to save class',
        description: error.message || 'An error occurred while saving the class.',
        variant: 'destructive',
      });
    },
  });

  // Remove class mutation
  const removeClassMutation = useMutation({
    mutationFn: async (classId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('saved_classes')
        .delete()
        .eq('student_id', user.id)
        .eq('class_id', classId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-classes'] });
      toast({
        title: 'Class removed',
        description: 'The class has been removed from your saved list.',
      });
    },
    onError: (error: any) => {
      console.error('Error removing class:', error);
      toast({
        title: 'Failed to remove class',
        description: error.message || 'An error occurred while removing the class.',
        variant: 'destructive',
      });
    },
  });

  // Get saved class IDs for quick lookup
  const savedClassIds = savedClasses.map(saved => saved.class_id);

  // Toggle save/unsave
  const toggleSaveClass = (classId: string) => {
    const isSaved = savedClassIds.includes(classId);
    
    if (isSaved) {
      removeClassMutation.mutate(classId);
    } else {
      saveClassMutation.mutate(classId);
    }
  };

  // Check if a class is saved
  const isClassSaved = (classId: string) => {
    return savedClassIds.includes(classId);
  };

  return {
    savedClasses,
    savedClassIds,
    isLoading,
    error,
    toggleSaveClass,
    isClassSaved,
    isToggling: saveClassMutation.isPending || removeClassMutation.isPending,
  };
};