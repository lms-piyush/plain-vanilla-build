
export interface ClassReview {
  id: string;
  class_id: string;
  student_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  profiles?: {
    full_name: string;
  } | null;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}
