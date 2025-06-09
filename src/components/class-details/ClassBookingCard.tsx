
import { Calendar, Clock, Users, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ClassBookingCardProps {
  price: number;
  priceInterval: string;
  startDate?: string;
  schedule?: string;
  spotsAvailable?: number;
  totalSpots?: number;
  location?: string;
  category: string;
  level: string;
  ageRange: string;
  lectureType: string;
  isRecorded: boolean;
  isEnrolling: boolean;
  onEnroll: () => void;
}

const ClassBookingCard = ({
  price,
  priceInterval,
  startDate,
  schedule,
  spotsAvailable,
  totalSpots,
  location,
  category,
  level,
  ageRange,
  lectureType,
  isRecorded,
  isEnrolling,
  onEnroll
}: ClassBookingCardProps) => {
  const isGroupClass = lectureType === "online-live-group" || lectureType === "live-group";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">${price}</span>
            <span className="text-muted-foreground">per {priceInterval}</span>
          </div>
          
          <div className="space-y-2">
            {!isRecorded && startDate && (
              <>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Starts {startDate}</span>
                </div>
                {schedule && (
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{schedule}</span>
                  </div>
                )}
              </>
            )}
            
            {isRecorded && (
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Watch anytime, unlimited access</span>
              </div>
            )}
            
            {isGroupClass && spotsAvailable && totalSpots && (
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{spotsAvailable} spots left (of {totalSpots})</span>
              </div>
            )}
            
            {location && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{location}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{category.replace('-', ' ')}</Badge>
            <Badge variant="outline">{level}</Badge>
            <Badge variant="outline">{ageRange}</Badge>
          </div>
          
          <div className="pt-2">
            <Button 
              onClick={onEnroll}
              disabled={isEnrolling}
              className="w-full mb-2"
            >
              {isEnrolling ? "Enrolling..." : "Enroll in Class"}
            </Button>
            <Button variant="outline" className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message the Tutor
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassBookingCard;
