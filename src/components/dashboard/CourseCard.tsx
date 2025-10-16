import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Heart, Clock, Users, Calendar, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  id: string;
  title: string;
  tutor: string;
  tutorId?: string;
  tutorAvatar?: string;
  rating: number;
  reviewCount?: number;
  image: string;
  description?: string;
  mode?: string;
  format?: string;
  classSize?: string;
  students?: number;
  maxStudents?: number;
  price?: string;
  isSubscription?: boolean;
  wishListed?: boolean;
  ageRange?: string;
  duration?: string;
  schedule?: string;
  spotsLeft?: number;
  onClick?: () => void;
  onTutorClick?: () => void;
  onWishlistToggle?: () => void;
}

const CourseCard = ({ 
  id, 
  title, 
  tutor, 
  tutorId,
  tutorAvatar,
  rating, 
  reviewCount = 0,
  image, 
  description, 
  mode, 
  format,
  classSize,
  students,
  maxStudents,
  price,
  isSubscription,
  wishListed = false,
  ageRange,
  duration,
  schedule,
  spotsLeft,
  onClick,
  onTutorClick,
  onWishlistToggle
}: CourseCardProps) => {
  const getTutorInitials = () => {
    return tutor.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const showUrgencyBadge = spotsLeft !== undefined && spotsLeft > 0 && spotsLeft <= 5;

  return (
    <Card 
      className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col group border hover:border-primary/20"
      onClick={onClick}
    >
      {/* Tutor Section */}
      <div className="p-4 pb-3 border-b bg-gradient-to-r from-background to-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar 
              className="h-12 w-12 border-2 border-primary/20 cursor-pointer hover:border-primary transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onTutorClick?.();
              }}
            >
              <AvatarImage src={tutorAvatar} alt={tutor} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getTutorInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <button 
                className="font-semibold text-base text-foreground hover:text-primary hover:underline transition-colors block truncate text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  onTutorClick?.();
                }}
              >
                {tutor}
              </button>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 stroke-yellow-400 mr-1" />
                  <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
                </div>
                {reviewCount > 0 && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{reviewCount.toLocaleString()} reviews</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {onWishlistToggle && (
            <button 
              className="p-2 rounded-full hover:bg-muted transition-all duration-200 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onWishlistToggle();
              }}
            >
              <Heart 
                className={`h-5 w-5 ${wishListed ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'} transition-colors`} 
              />
            </button>
          )}
        </div>
      </div>

      {/* Class Image */}
      <div className="relative h-48 bg-muted">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {mode && (
          <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground hover:bg-primary shadow-lg">
            {mode}
          </Badge>
        )}
        {showUrgencyBadge && (
          <Badge className="absolute top-3 right-3 bg-destructive/90 text-destructive-foreground hover:bg-destructive shadow-lg animate-pulse">
            Only {spotsLeft} spots left!
          </Badge>
        )}
      </div>

      {/* Class Details */}
      <CardContent className="p-5 flex flex-col flex-grow">
        <div className="flex-grow space-y-3">
          <h3 className="font-bold text-xl mb-2 line-clamp-2 text-foreground leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          {/* Info Badges */}
          <div className="flex flex-wrap gap-2">
            {ageRange && (
              <Badge variant="secondary" className="text-xs font-medium px-2.5 py-1">
                <Users className="h-3 w-3 mr-1" />
                Ages {ageRange}
              </Badge>
            )}
            {duration && (
              <Badge variant="secondary" className="text-xs font-medium px-2.5 py-1">
                <Clock className="h-3 w-3 mr-1" />
                {duration}
              </Badge>
            )}
            {format && (
              <Badge variant="secondary" className="text-xs font-medium px-2.5 py-1">
                {format}
              </Badge>
            )}
          </div>

          {schedule && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{schedule}</span>
            </div>
          )}
          
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
          )}

          {classSize && students !== undefined && maxStudents && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{students}/{maxStudents} students enrolled</span>
            </div>
          )}
        </div>
        
        {/* Pricing Section */}
        {price && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-primary">
                  {price}
                </span>
                {isSubscription && (
                  <span className="text-sm font-normal text-muted-foreground ml-1">/week</span>
                )}
                <div className="text-xs text-muted-foreground mt-0.5">
                  {isSubscription ? "Weekly subscription" : "One-time payment"}
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4" />
                <span>Enrolling now</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
