
import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  hoveredRating: number;
  onRatingChange: (rating: number) => void;
  onHover: (rating: number) => void;
  onLeave: () => void;
  showError?: boolean;
}

const StarRating = ({
  rating,
  hoveredRating,
  onRatingChange,
  onHover,
  onLeave,
  showError = false
}: StarRatingProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Rating</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-1 transition-colors"
            onMouseEnter={() => onHover(star)}
            onMouseLeave={onLeave}
            onClick={() => onRatingChange(star)}
          >
            <Star
              className={`h-6 w-6 ${
                star <= (hoveredRating || rating)
                  ? 'fill-yellow-400 stroke-yellow-400'
                  : 'stroke-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      {showError && (
        <p className="text-sm text-red-500 mt-1">Please select a rating</p>
      )}
    </div>
  );
};

export default StarRating;
