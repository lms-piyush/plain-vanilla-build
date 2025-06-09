
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  MessageCircle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ClassCardProps {
  id: string;
  title: string;
  tutor: string;
  tutorId: string;
  type: string;
  format: string;
  payment: string;
  status: string;
  students: number;
  image: string;
  rating: number;
  description: string;
  classSize: string;
  onClick: () => void;
  onTutorClick: () => void;
  onMessageTutor: () => void;
}

const ClassCard = ({
  title,
  tutor,
  tutorId,
  type,
  format,
  payment,
  status,
  students,
  image,
  rating,
  description,
  classSize,
  onClick,
  onTutorClick,
  onMessageTutor,
}: ClassCardProps) => {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
      <div className="flex flex-col md:flex-row h-full">
        <div className="relative h-40 md:h-auto md:w-1/3 lg:w-1/4">
          <img src={image} alt={title} className="h-full w-full object-cover" />
        </div>
        <CardContent className="p-4 flex flex-col flex-1" onClick={onClick}>
          <div className="flex justify-between">
            <h3 className="font-medium text-lg">{title}</h3>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                status === "Completed" 
                  ? "bg-gray-100 text-gray-800" 
                  : status === "Enrolled" 
                  ? "bg-blue-100 text-blue-800" 
                  : "bg-green-100 text-green-800"
              }`}>
                {status}
              </span>
              <span className="px-2 py-1 rounded-full text-xs bg-[#E5D0FF] text-[#8A5BB7]">
                {payment}
              </span>
            </div>
          </div>
          
          <div className="flex items-center mt-1">
            <button 
              className="text-sm font-medium text-[#8A5BB7] hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onTutorClick();
              }}
            >
              {tutor}
            </button>
            <div className="flex items-center ml-4">
              <Star className="h-3 w-3 fill-yellow-400 stroke-yellow-400 mr-1" />
              <span className="text-xs font-medium">{rating.toFixed(1)}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{description}</p>
          
          <div className="flex justify-between mt-auto pt-4">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-gray-100">
                {type}
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-100">
                {format}
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-100">
                {classSize === "Group" ? `Students: ${students}` : "1-on-1"}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onMessageTutor();
                }}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>
              {status === "Completed" ? (
                <Button 
                  size="sm" 
                  className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReviewDialogOpen(true);
                  }}
                >
                  Submit Review
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
                >
                  {type === "Online" ? "Continue" : "View Class"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </div>
      
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Your Review</DialogTitle>
            <DialogDescription>
              Share your experience with this class to help other learners.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`h-8 w-8 cursor-pointer ${reviewRating >= star ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"}`}
                  onClick={() => setReviewRating(star)}
                />
              ))}
            </div>
            
            <Textarea 
              placeholder="Write your feedback about the class..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-32"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
              onClick={() => {
                // Submit review logic would go here
                setReviewDialogOpen(false);
                // Reset form
                setReviewText("");
                setReviewRating(5);
              }}
            >
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ClassCard;
