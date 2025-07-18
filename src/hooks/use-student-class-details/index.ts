
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { StudentClassDetails } from "./types";
import { fetchClassData, fetchTutorName, checkEnrollmentStatus } from "./data-fetcher";
import { processLessons } from "./lesson-utils";
import { useClassReviewStats } from "@/hooks/use-class-review-stats";

export type { StudentClassDetails };

export const useStudentClassDetails = (classId: string) => {
  const [classDetails, setClassDetails] = useState<StudentClassDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Fetch review stats
  const { data: reviewStats } = useClassReviewStats(classId);

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
      let isCurrentBatch = true;
      let enrolledBatch: number | undefined;
      
      if (user) {
        const enrollmentStatus = await checkEnrollmentStatus(user.id, classId);
        isEnrolled = enrollmentStatus.isEnrolled;
        isCurrentBatch = enrollmentStatus.isCurrentBatch;
        enrolledBatch = enrollmentStatus.enrolledBatch;
      }

      // Process lessons data
      const finalLessons = processLessons(classData.class_syllabus);

      setClassDetails({
        ...classData,
        tutor_name: tutorName,
        lessons: finalLessons,
        isEnrolled,
        isCurrentBatch,
        enrolledBatch
      });
      setError(null);
    } catch (err: any) {
      console.error("Error fetching class details:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassDetails();
  }, [user, classId]);

  return {
    classDetails,
    isLoading,
    error,
    refetch: fetchClassDetails,
    reviewStats: reviewStats || { average_rating: 0, total_reviews: 0 }
  };
};
