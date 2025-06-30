
import { supabase } from "@/integrations/supabase/client";
import { ClassReview } from "./types";

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
  }
};
