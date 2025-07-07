import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, BookOpen, User } from "lucide-react";

interface ReviewTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: "class" | "tutor") => void;
  hasClassReview: boolean;
  hasTutorReview: boolean;
  tutorName: string;
  className: string;
}

const ReviewTypeModal = ({ 
  isOpen, 
  onClose, 
  onSelectType,
  hasClassReview,
  hasTutorReview,
  tutorName,
  className
}: ReviewTypeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Review Type</DialogTitle>
          <DialogDescription>
            Select whether you want to review the class or the tutor.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary"
            onClick={() => onSelectType("class")}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Review Class</h3>
                  <p className="text-sm text-muted-foreground">{className}</p>
                  {hasClassReview && (
                    <p className="text-xs text-green-600 mt-1">✓ Already reviewed</p>
                  )}
                </div>
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary"
            onClick={() => onSelectType("tutor")}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Review Tutor</h3>
                  <p className="text-sm text-muted-foreground">{tutorName}</p>
                  {hasTutorReview && (
                    <p className="text-xs text-green-600 mt-1">✓ Already reviewed</p>
                  )}
                </div>
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewTypeModal;