
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
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col group"
      onClick={onClick}
    >
      <div className="relative h-48">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {onWishlistToggle && (
          <button 
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onWishlistToggle();
            }}
          >
            <Heart 
              className={`h-5 w-5 ${wishListed ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'} transition-colors`} 
            />
          </button>
        )}
      </div>
      <CardContent className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900">{title}</h3>
          
          <div className="flex items-center justify-between mb-3">
            {onTutorClick ? (
              <button 
                className="text-sm font-medium text-[#8A5BB7] hover:text-[#6B46C1] hover:underline transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onTutorClick();
                }}
              >
                {tutor}
              </button>
            ) : (
              <span className="text-sm text-gray-600 font-medium">{tutor}</span>
            )}
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400 mr-1" />
              <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
            </div>
          </div>
          
          {description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{description}</p>
          )}
          
          {(mode || format || classSize) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {mode && (
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                  {mode}
                </span>
              )}
              {format && (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                  {format}
                </span>
              )}
              {classSize && (
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
                  {classSize === "Group" && students ? `${students} students` : classSize}
                </span>
              )}
            </div>
          )}
        </div>
        
        {price && (
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-[#8A5BB7]">
                {price}
                {isSubscription && <span className="text-sm font-normal text-gray-500">/month</span>}
              </span>
              <div className="text-xs text-gray-500">
                {isSubscription ? "Subscription" : "One-time"}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
