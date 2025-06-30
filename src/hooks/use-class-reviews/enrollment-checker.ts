
import { supabase } from "@/integrations/supabase/client";
import { ClassReview } from "./types";

export const checkUserEnrollmentAndReview = async (
  classId: string,
  userId: string
): Promise<{
  isEnrolled: boolean;
  hasReviewed: boolean;
  userReview: ClassReview | null;
}> => {
  // Check enrollment status
  const { data: enrollmentData } = await supabase
    .from("student_enrollments")
    .select("id")
    .eq("class_id", classId)
    .eq("student_id", userId)
    .eq("status", "active")
    .maybeSingle();

  const isEnrolled = !!enrollmentData;

  // Check if user has reviewed
  const { data: userReviewData } = await supabase
    .from("class_reviews")
    .select("*")
    .eq("class_id", classId)
    .eq("student_id", userId)
    .maybeSingle();

  return {
    isEnrolled,
    hasReviewed: !!userReviewData,
    userReview: userReviewData || null
  };
};
