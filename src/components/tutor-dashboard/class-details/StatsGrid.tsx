
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Star, BookOpen } from "lucide-react";
import { ClassDetails } from "@/hooks/use-class-details";

interface StatsGridProps {
  classDetails: ClassDetails;
  enrolledCount: number;
  completedSessions: number;
  totalSessions: number;
}

const StatsGrid = ({ classDetails, enrolledCount, completedSessions, totalSessions }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <Card className="border-[#1F4E79]/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Students</p>
              <p className="text-2xl font-bold">{enrolledCount}</p>
            </div>
            <Users className="h-8 w-8 text-[#1F4E79]" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#1F4E79]/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sessions</p>
              <p className="text-2xl font-bold">{completedSessions}/{totalSessions}</p>
            </div>
            <Calendar className="h-8 w-8 text-[#1F4E79]" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#1F4E79]/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rating</p>
              <p className="text-2xl font-bold">4.8</p>
            </div>
            <Star className="h-8 w-8 text-[#F29F05]" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#1F4E79]/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Earnings</p>
              <p className="text-2xl font-bold">${classDetails.price || 0}</p>
            </div>
            <BookOpen className="h-8 w-8 text-[#1F4E79]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsGrid;
