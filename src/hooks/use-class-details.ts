
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ClassDetails } from "@/types/class-details";
import { fetchClassData } from "@/utils/class-data-fetcher";
import { fetchClassEnrollments } from "@/utils/class-enrollment-utils";

export const useClassDetails = (classId: string) => {
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchClassDetails = async () => {
    if (!user || !classId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch the main class data
      const classData = await fetchClassData(classId, user.id);
      
      // Fetch student enrollments
      const enrolledStudents = await fetchClassEnrollments(classId);

      setClassDetails({
        ...(classData as any),
        enrolled_students: enrolledStudents as any,
      } as ClassDetails);
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
  };
};
