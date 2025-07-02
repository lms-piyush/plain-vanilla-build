
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  MessageCircle,
} from "lucide-react";
import { useCreateConversation } from "@/hooks/use-conversations";
import { useClassReviews } from "@/hooks/use-class-reviews";
import { toast } from "@/components/ui/use-toast";
import WriteReviewModal from "./class-details/WriteReviewModal";

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
  id,
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
}: ClassCardProps) => {
  const navigate = useNavigate();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  const createConversationMutation = useCreateConversation();
  
  // Use the existing review hook to check if user has reviewed and get existing review
  const {
    hasUserReviewed,
    userReview,
    submitReview,
  } = useClassReviews(id);

  const handleMessageTutor = async () => {
    try {
      const conversation = await createConversationMutation.mutateAsync({
        tutorId: tutorId,
        classId: id,
      });

      navigate(`/student/messages?conversation=${conversation.id}`);
    } catch (error: any) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitReview = async (rating: number, reviewText: string) => {
    setIsSubmittingReview(true);
    const success = await submitReview(rating, reviewText);
    setIsSubmittingReview(false);
    
    if (success) {
      setReviewDialogOpen(false);
      toast({
        title: hasUserReviewed ? "Review Updated" : "Review Submitted",
        description: hasUserReviewed 
          ? "Your review has been updated successfully!" 
          : "Thank you for your feedback!",
      });
    }
    
    return success;
  };

  const getActionButton = () => {
    if (status === "Completed") {
      return (
        <Button 
          size="sm" 
          className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
          onClick={(e) => {
            e.stopPropagation();
            setReviewDialogOpen(true);
          }}
        >
          {hasUserReviewed ? "Update Review" : "Submit Review"}
        </Button>
      );
    } else {
      return (
        <Button 
          size="sm" 
          className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
        >
          {type === "Online" ? "Continue" : "View Class"}
        </Button>
      );
    }
  };

  return (
    <>
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
                    handleMessageTutor();
                  }}
                  disabled={createConversationMutation.isPending}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {createConversationMutation.isPending ? "..." : "Message"}
                </Button>
                {getActionButton()}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
      
      <WriteReviewModal
        isOpen={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        onSubmit={handleSubmitReview}
        isSubmitting={isSubmittingReview}
        existingReview={userReview}
        isUpdate={hasUserReviewed}
      />
    </>
  );
};

export default ClassCard;
