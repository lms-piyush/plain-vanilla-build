
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Session {
  id: string;
  title: string;
  description?: string;
  session_date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'upcoming';
  session_number: number;
  class_id: string;
  attendance?: string;
  notes?: string;
}

export const useClassSessions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createSession = async (sessionData: Omit<Session, 'id'>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('class_syllabus')
        .insert({
          class_id: sessionData.class_id,
          title: sessionData.title,
          description: sessionData.description,
          week_number: sessionData.session_number, // Map session_number to week_number in DB
          session_date: sessionData.session_date,
          start_time: sessionData.start_time,
          end_time: sessionData.end_time,
          status: sessionData.status,
          attendance: sessionData.attendance,
          notes: sessionData.notes,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Session created successfully",
        description: `Session "${sessionData.title}" has been created.`,
      });

      return data;
    } catch (error: any) {
      console.error('Error creating session:', error);
      toast({
        title: "Error creating session",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSession = async (sessionId: string, sessionData: Partial<Session>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('class_syllabus')
        .update({
          title: sessionData.title,
          description: sessionData.description,
          week_number: sessionData.session_number, // Map session_number to week_number in DB
          session_date: sessionData.session_date,
          start_time: sessionData.start_time,
          end_time: sessionData.end_time,
          status: sessionData.status,
          attendance: sessionData.attendance,
          notes: sessionData.notes,
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Session updated successfully",
        description: `Session has been updated.`,
      });

      return data;
    } catch (error: any) {
      console.error('Error updating session:', error);
      toast({
        title: "Error updating session",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('class_syllabus')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Session deleted successfully",
        description: "The session has been removed.",
      });
    } catch (error: any) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error deleting session",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createSession,
    updateSession,
    deleteSession,
    isLoading,
  };
};
