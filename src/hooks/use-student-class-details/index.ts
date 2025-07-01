import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { StudentClassDetails } from "./types";
import { fetchClassData, fetchTutorName, checkEnrollmentStatus } from "./data-fetcher";
import { processLessons } from "./lesson-utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchClassReviewStats, ClassReviewStats } from "./review-stats-fetcher";

export type { StudentClassDetails };

export const useStudentClassDetails = (classId: string) => {
  const [classDetails, setClassDetails] = useState<StudentClassDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchClassDetails = async () => {
    if (!classId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch the main class data
      const classData = await fetchClassData(classId);

      // Fetch tutor information with fallback to email
      const tutorName = await fetchTutorName(classData.tutor_id);

      // Check if user is enrolled (only if user is logged in)
      let isEnrolled = false;
      if (user) {
        isEnrolled = await checkEnrollmentStatus(user.id, classId);
      }

      // Process lessons data
      const finalLessons = processLessons(classData.class_syllabus);

      setClassDetails({
        ...classData,
        tutor_name: tutorName,
        lessons: finalLessons,
        isEnrolled
      });
      setError(null);
    } catch (err: any) {
      console.error("Error fetching class details:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add review stats query
  const { data: reviewStats } = useQuery({
    queryKey: ["class-review-stats", classId],
    queryFn: () => fetchClassReviewStats(classId),
    enabled: !!classId,
  });

  useEffect(() => {
    fetchClassDetails();
  }, [user, classId]);

  return {
    classDetails,
    isLoading,
    error,
    refetch: fetchClassDetails,
    reviewStats: reviewStats || { averageRating: 0, totalReviews: 0 }
  };
};
