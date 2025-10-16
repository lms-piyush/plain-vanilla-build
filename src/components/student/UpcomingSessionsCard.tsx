import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface UpcomingSession {
  id: string;
  class_id: string;
  class_title: string;
  session_date: string;
  start_time: string;
  end_time: string;
  delivery_mode: string;
  meeting_link?: string;
  location?: string;
}

interface UpcomingSessionsCardProps {
  sessions: UpcomingSession[];
  isLoading?: boolean;
}

const UpcomingSessionsCard = ({ sessions, isLoading }: UpcomingSessionsCardProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>Your next classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>Your next classes</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No upcoming sessions scheduled.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Sessions</CardTitle>
        <CardDescription>Your next classes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold">{session.class_title}</h4>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(session.session_date), "MMM d, yyyy")}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{session.start_time} - {session.end_time}</span>
                  </div>
                  
                  {session.delivery_mode === "online" && session.meeting_link && (
                    <div className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      <span>Online</span>
                    </div>
                  )}
                  
                  {session.delivery_mode === "offline" && session.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate max-w-[200px]">{session.location}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  onClick={() => navigate(`/student/classes/${session.class_id}`)}
                >
                  View Class
                </Button>
                {session.delivery_mode === "online" && session.meeting_link && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(session.meeting_link, "_blank")}
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Join
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingSessionsCard;