
import { BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TutorInfo {
  id: string;
  name: string;
  title: string;
  image: string;
  bio: string;
  rating: number;
  classesCount: number;
  studentsCount: number;
  verified: boolean;
}

interface TutorInfoCardProps {
  tutor: TutorInfo;
}

const TutorInfoCard = ({ tutor }: TutorInfoCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={tutor.image} alt={tutor.name} />
            <AvatarFallback>{tutor.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <h3 className="font-bold">{tutor.name}</h3>
              {tutor.verified && (
                <BadgeCheck className="h-4 w-4 text-primary ml-1" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{tutor.title}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
          <div className="p-2 rounded-md bg-muted">
            <div className="font-bold">{tutor.rating}</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </div>
          <div className="p-2 rounded-md bg-muted">
            <div className="font-bold">{tutor.classesCount}</div>
            <div className="text-xs text-muted-foreground">Classes</div>
          </div>
          <div className="p-2 rounded-md bg-muted">
            <div className="font-bold">{tutor.studentsCount}</div>
            <div className="text-xs text-muted-foreground">Students</div>
          </div>
        </div>
        
        <p className="text-sm mb-4">{tutor.bio}</p>
        
        <Button variant="outline" className="w-full">
          View Full Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default TutorInfoCard;
