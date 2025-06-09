
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

interface ReviewsTabProps {
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

const ReviewsTab = ({ rating, reviewCount, reviews }: ReviewsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Star className="h-6 w-6 fill-primary text-primary" />
        <span className="text-2xl font-bold">{rating}</span>
        <span className="text-muted-foreground">({reviewCount} reviews)</span>
      </div>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={review.avatar} alt={review.user} />
                  <AvatarFallback>{review.user[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{review.user}</div>
                  <div className="text-xs text-muted-foreground">{review.date}</div>
                </div>
              </div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                  />
                ))}
              </div>
              <p className="text-sm">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewsTab;
