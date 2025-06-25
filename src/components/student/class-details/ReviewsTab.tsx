
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ReviewsTabProps {
  classId: string;
}

const ReviewsTab = ({ classId }: ReviewsTabProps) => {
  // Dummy review data - in a real app, this would come from a reviews table
  const reviews = [
    {
      id: 1,
      student_name: "Sarah M.",
      rating: 5,
      comment: "Excellent class! The instructor explains concepts very clearly and provides great examples.",
      date: "2024-12-15"
    },
    {
      id: 2,
      student_name: "John D.",
      rating: 4,
      comment: "Good content and well-structured lessons. Would recommend to others.",
      date: "2024-12-10"
    },
    {
      id: 3,
      student_name: "Emily R.",
      rating: 5,
      comment: "Amazing experience! Learned so much and the materials were very helpful.",
      date: "2024-12-05"
    }
  ];

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
            {averageRating.toFixed(1)} Average Rating
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Based on {reviews.length} reviews
          </p>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{review.student_name}</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? 'fill-yellow-400 stroke-yellow-400'
                          : 'stroke-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-2">{review.comment}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(review.date).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewsTab;
