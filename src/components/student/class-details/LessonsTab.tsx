
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, MapPin } from "lucide-react";
import { StudentClassDetails } from "@/hooks/use-student-class-details";
import AddressModal from "../AddressModal";

interface LessonsTabProps {
  classDetails: StudentClassDetails;
}

const LessonsTab = ({ classDetails }: LessonsTabProps) => {
  const [addressModalOpen, setAddressModalOpen] = useState(false);

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

  const isOfflineClass = classDetails.delivery_mode === 'offline';

  // Sort lessons by created_at in descending order (most recent first)
  const sortedLessons = classDetails.lessons?.sort((a, b) => {
    // First try to sort by created_at if available
    const aCreatedAt = new Date('2024-01-01'); // Fallback since created_at not in interface
    const bCreatedAt = new Date('2024-01-01'); // Fallback since created_at not in interface
    
    // If both have session_date, use that for comparison (most recent first)
    if (a.session_date && b.session_date) {
      return new Date(b.session_date).getTime() - new Date(a.session_date).getTime();
    }
    // Fallback to week_number in descending order
    return b.week_number - a.week_number;
  }) || [];

  return (
    <>
      <div className="space-y-4">
        {sortedLessons.map((lesson) => (
          <Card key={lesson.id} className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {lesson.title}
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
              
              <div className="flex gap-2">
                {/* Conditional button display based on class type */}
                {isOfflineClass ? (
                  // For offline classes, show only View Address button
                  lesson.status === 'upcoming' && (
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => setAddressModalOpen(true)}
                    >
                      <MapPin className="h-4 w-4" />
                      View Address
                    </Button>
                  )
                ) : (
                  // For online classes, show only Join Class Now button
                  lesson.session_date && (
                    <>
                      {lesson.status === 'completed' ? (
                        <Button 
                          disabled
                          className="flex-1"
                        >
                          Class Started on {formatDate(lesson.session_date)}
                        </Button>
                      ) : (
                        <Button 
                          className="flex-1 bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
                          onClick={() => handleJoinClass(lesson.id)}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Class Now
                        </Button>
                      )}
                    </>
                  )
                )}
              </div>

              {isOfflineClass && classDetails.class_format === 'outbound' && (
                <div className="mt-3 p-3 bg-purple-50 rounded-md text-sm flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-[#8A5BB7] mt-0.5" />
                  <span>The tutor will visit your location for this class.</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <AddressModal 
        open={addressModalOpen}
        onOpenChange={setAddressModalOpen}
        classDetails={classDetails}
      />
    </>
  );
};

export default LessonsTab;
