
import React from "react";
import { Star } from "lucide-react";

interface StarDisplayProps {
  rating: number;
  size?: "sm" | "md";
}

const StarDisplay = ({ rating, size = "sm" }: StarDisplayProps) => {
  const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${starSize} ${
            i < rating
              ? 'fill-yellow-400 stroke-yellow-400'
              : 'stroke-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default StarDisplay;
