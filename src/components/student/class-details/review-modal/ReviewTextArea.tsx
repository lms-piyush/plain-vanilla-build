
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface ReviewTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

const ReviewTextArea = ({ 
  value, 
  onChange, 
  maxLength = 1000 
}: ReviewTextAreaProps) => {
  return (
    <div>
      <label htmlFor="review-text" className="text-sm font-medium mb-2 block">
        Review (Optional)
      </label>
      <Textarea
        id="review-text"
        placeholder="Tell us about your experience with this class..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        maxLength={maxLength}
      />
      <p className="text-xs text-gray-500 mt-1">
        {value.length}/{maxLength} characters
      </p>
    </div>
  );
};

export default ReviewTextArea;
