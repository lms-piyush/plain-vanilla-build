import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface TutorProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  position?: string;
  bio?: string;
  years_experience?: number;
  languages_spoken?: string[];
}

export interface TutorStatistics {
  totalCourses: number;
  totalStudents: number;
}

export const useTutorProfile = (userId?: string) => {
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [statistics, setStatistics] = useState<TutorStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadProfile = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      setProfile(profileData);

      // Fetch statistics
      const { data: classesData, error: classesError } = await supabase
        .from("classes")
        .select("id")
        .eq("tutor_id", userId);

      if (classesError) throw classesError;

      const totalCourses = classesData?.length || 0;

      // Get total students enrolled
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from("student_enrollments")
        .select("student_id")
        .in("class_id", classesData?.map(c => c.id) || []);

      if (enrollmentsError) throw enrollmentsError;

      // Count unique students
      const uniqueStudents = new Set(enrollmentsData?.map(e => e.student_id) || []);
      const totalStudents = uniqueStudents.size;

      setStatistics({
        totalCourses,
        totalStudents,
      });

    } catch (error: any) {
      console.error("Error fetching tutor profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<TutorProfile>) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

      if (error) throw error;

      // Reload profile data
      await loadProfile();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    loadProfile();
  }, [userId]);

  return {
    profile,
    statistics,
    isLoading,
    updateProfile,
    refetch: loadProfile,
  };
};