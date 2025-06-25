
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, MapPin } from "lucide-react";
import { StudentClassDetails } from "@/hooks/use-student-class-details";

interface LessonsTabProps {
  classDetails: StudentClassDetails;
}

const LessonsTab = ({ classDetails }: LessonsTabProps) => {
  const isToday = (date: string) => {
    const today = new Date();
    const sessionDate = new Date(date);
    return sessionDate.getDate() === today.getDate() &&
      sessionDate.getMonth() === today.getMonth() &&
      sessionDate.getFullYear() === today.getFullYear();
  };

  const isPast = (date: string) => {
    const today = new Date();
    const sessionDate = new Date(date);
    return sessionDate < today && !isToday(date);
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleJoinClass = (lessonId: string) => {
    console.log('Joining class for lesson:', lessonId);
    // Handle join class logic here
  };

  return (
    <div className="space-y-4">
      {classDetails.lessons?.map((lesson) => (
        <Card key={lesson.id} className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {lesson.week_number}. {lesson.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {lesson.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {lesson.session_date && (
              <div className="flex items-center gap-2 text-sm mb-3">
                <Calendar className="h-4 w-4 text-[#8A5BB7]" />
                <span>{formatDate(lesson.session_date)}</span>
                {lesson.start_time && lesson.end_time && (
                  <>
                    <Clock className="h-4 w-4 text-[#8A5BB7] ml-3" />
                    <span>{formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}</span>
                  </>
                )}
              </div>
            )}
            
            {lesson.materials.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Resources</h4>
                <div className="flex flex-wrap gap-2">
                  {lesson.materials.map((material) => (
                    <Button
                      key={material.id}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {material.material_name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {lesson.session_date && (
              <>
                {lesson.is_completed || isPast(lesson.session_date) ? (
                  <Button 
                    disabled
                    className="w-full mt-2"
                  >
                    Class Started on {formatDate(lesson.session_date)}
                  </Button>
                ) : isToday(lesson.session_date) ? (
                  <Button 
                    className="w-full bg-[#8A5BB7] hover:bg-[#8A5BB7]/90 mt-2"
                    onClick={() => handleJoinClass(lesson.id)}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Join Class Now
                  </Button>
                ) : (
                  <Button 
                    disabled
                    className="w-full mt-2"
                  >
                    Class Starts on {formatDate(lesson.session_date)}
                  </Button>
                )}
              </>
            )}

            {classDetails.delivery_mode === 'offline' && classDetails.class_format === 'outbound' && (
              <div className="mt-3 p-3 bg-purple-50 rounded-md text-sm flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#8A5BB7] mt-0.5" />
                <span>The tutor will visit your location for this class.</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LessonsTab;
