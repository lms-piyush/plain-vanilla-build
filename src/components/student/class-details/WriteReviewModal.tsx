
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClassReview } from "@/hooks/use-class-reviews";
import StarRating from "./review-modal/StarRating";
import ReviewTextArea from "./review-modal/ReviewTextArea";

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, reviewText: string) => Promise<boolean>;
  isSubmitting?: boolean;
  existingReview?: ClassReview | null;
  isUpdate?: boolean;
}

const WriteReviewModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting = false,
  existingReview,
  isUpdate = false
}: WriteReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // Pre-fill form when updating existing review
  useEffect(() => {
    if (isOpen && isUpdate && existingReview) {
      setRating(existingReview.rating);
      setReviewText(existingReview.review_text || "");
    } else if (isOpen && !isUpdate) {
      // Reset form for new review
      setRating(0);
      setReviewText("");
    }
  }, [isOpen, isUpdate, existingReview]);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    const success = await onSubmit(rating, reviewText);
    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (!isUpdate) {
      setRating(0);
      setHoveredRating(0);
      setReviewText("");
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? "Update Your Review" : "Write a Review"}
          </DialogTitle>
          <DialogDescription>
            {isUpdate 
              ? "Update your experience with this class to help other students."
              : "Share your experience with this class to help other students."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <StarRating
            rating={rating}
            hoveredRating={hoveredRating}
            onRatingChange={setRating}
            onHover={setHoveredRating}
            onLeave={() => setHoveredRating(0)}
            showError={rating === 0}
          />

          <ReviewTextArea
            value={reviewText}
            onChange={setReviewText}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting 
              ? (isUpdate ? "Updating..." : "Submitting...") 
              : (isUpdate ? "Update Review" : "Submit Review")
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WriteReviewModal;
