import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, Plus } from "lucide-react";
import { ClassDetails } from "@/types/class-details";

interface NextSessionProps {
  classDetails: ClassDetails;
}

const NextSession = ({ classDetails }: NextSessionProps) => {
  const getNextSession = () => {
    if (!classDetails.class_schedules?.[0] || !classDetails.class_time_slots?.[0]) {
      return null;
    }

    const schedule = classDetails.class_schedules[0];
    const timeSlot = classDetails.class_time_slots[0];
    
    // Calculate next session based on frequency
    const today = new Date();
    const startDate = new Date(schedule.start_date || today);
    
    // Simple logic to get next session (you can enhance this)
    const nextSession = new Date(startDate);
    if (schedule.frequency === 'weekly') {
      nextSession.setDate(today.getDate() + 7);
    } else if (schedule.frequency === 'daily') {
      nextSession.setDate(today.getDate() + 1);
    } else if (schedule.frequency === 'monthly') {
      nextSession.setMonth(today.getMonth() + 1);
    }

    return {
      date: nextSession.toLocaleDateString(),
      time: `${timeSlot.start_time} - ${timeSlot.end_time}`,
      title: "Next Session"
    };
  };

  const nextSession = getNextSession();

  return (
    <Card className="border-[#1F4E79]/10">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#1F4E79]">Next Session</CardTitle>
      </CardHeader>
      <CardContent>
        {nextSession ? (
          <div className="space-y-4">
            <div className="bg-[#F5F7FA] p-3 rounded-lg">
              <p className="font-medium text-sm">{nextSession.title}</p>
              <div className="space-y-2 mt-2">
                <div className="flex items-center text-xs">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-[#1F4E79]" />
                  <span>{nextSession.date}</span>
                </div>
                <div className="flex items-center text-xs">
                  <Clock className="h-3.5 w-3.5 mr-2 text-[#1F4E79]" />
                  <span>{nextSession.time}</span>
                </div>
              </div>
            </div>
            <Button className="w-full bg-[#1F4E79] hover:bg-[#1a4369] text-sm">
              <Video className="mr-2 h-4 w-4" />
              Start Session
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">No upcoming sessions</p>
            <Button variant="outline" className="mt-2 text-xs border-[#1F4E79] text-[#1F4E79]">
              <Plus className="mr-1 h-3.5 w-3.5" />
              Schedule Session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NextSession;
