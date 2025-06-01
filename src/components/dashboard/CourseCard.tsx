
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Heart } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  tutor: string;
  tutorId?: string;
  rating: number;
  image: string;
  description?: string;
  mode?: string;
  format?: string;
  classSize?: string;
  students?: number;
  price?: string;
  isSubscription?: boolean;
  wishListed?: boolean;
  onClick?: () => void;
  onTutorClick?: () => void;
  onWishlistToggle?: () => void;
}

const CourseCard = ({ 
  id, 
  title, 
  tutor, 
  tutorId,
  rating, 
  image, 
  description, 
  mode, 
  format,
  classSize,
  students,
  price,
  isSubscription,
  wishListed = false,
  onClick,
  onTutorClick,
  onWishlistToggle
}: CourseCardProps) => {
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      <div className="relative h-40">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        {onWishlistToggle && (
          <button 
            className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onWishlistToggle();
            }}
          >
            <Heart 
              className={`h-5 w-5 ${wishListed ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
            />
          </button>
        )}
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-base mb-1 line-clamp-1">{title}</h3>
        
        <div className="flex items-center mb-2">
          {onTutorClick ? (
            <button 
              className="text-sm font-medium text-[#8A5BB7] hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onTutorClick();
              }}
            >
              {tutor}
            </button>
          ) : (
            <span className="text-sm text-gray-600">{tutor}</span>
          )}
          <div className="flex items-center ml-4">
            <Star className="h-3 w-3 fill-yellow-400 stroke-yellow-400 mr-1" />
            <span className="text-xs font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        {description && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{description}</p>
        )}
        
        {(mode || format || classSize) && (
          <div className="mt-auto">
            <div className="flex flex-wrap gap-2 text-xs mb-3">
              {mode && (
                <span className="px-2 py-1 rounded-full bg-gray-100">
                  {mode}
                </span>
              )}
              {format && (
                <span className="px-2 py-1 rounded-full bg-gray-100">
                  {format}
                </span>
              )}
              {classSize && (
                <span className="px-2 py-1 rounded-full bg-gray-100">
                  {classSize === "Group" && students ? `Students: ${students}` : "1-on-1"}
                </span>
              )}
            </div>
            
            {price && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#8A5BB7]">
                  {price}
                  {isSubscription && <span className="text-xs font-normal">/month</span>}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
