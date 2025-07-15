
import { supabase } from "@/integrations/supabase/client";
import { ClassReview } from "./types";
import { notificationService } from "@/services/notification-service";

export const submitReview = async (
  classId: string,
  userId: string,
  rating: number,
  reviewText: string,
  existingReview?: ClassReview | null
): Promise<void> => {
  if (existingReview) {
    // Update existing review
    const { error } = await supabase
      .from("class_reviews")
      .update({
        rating,
        review_text: reviewText.trim() || null,
      })
      .eq("id", existingReview.id);

    if (error) throw error;
  } else {
    // Create new review
    const { error } = await supabase
      .from("class_reviews")
      .insert({
        class_id: classId,
        student_id: userId,
        rating,
        review_text: reviewText.trim() || null,
      });

    if (error) throw error;

    // Send notification to tutor (only for new reviews)
    try {
      // Get class and student information
      const { data: classData } = await supabase
        .from("classes")
        .select("title, tutor_id")
        .eq("id", classId)
        .single();

      const { data: studentData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single();

      if (classData && studentData) {
        await notificationService.notifyClassReview(
          classId,
          classData.tutor_id,
          studentData.full_name,
          classData.title,
          rating
        );
      }
    } catch (notificationError) {
      console.error("Failed to send review notification:", notificationError);
      // Don't throw error as the review was submitted successfully
    }
  }
};
