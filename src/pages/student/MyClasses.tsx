
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, User, MessageSquare, Star, ChevronRight } from "lucide-react";
import { useStudentEnrollments } from "@/hooks/use-student-enrollments";
import { useNavigate } from "react-router-dom";
import { useMessageNavigation } from "@/hooks/use-message-navigation";

const MyClasses = () => {
  const navigate = useNavigate();
  const { handleMessageTutor, isLoading: isMessagingLoading } = useMessageNavigation();
  const { data: enrollments, isLoading, error } = useStudentEnrollments();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewClass = (classId: string) => {
    navigate(`/student/class/${classId}`);
  };

  const handleMessageTutorClick = (tutorId: string, classId: string) => {
    handleMessageTutor(tutorId, classId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading classes</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <User className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Classes Yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          You haven't enrolled in any classes yet. Explore our available classes to start your learning journey.
        </p>
        <Button onClick={() => navigate('/student/explore')}>
          Explore Classes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">My Classes</h1>
        <p className="text-muted-foreground">
          Manage your enrolled classes and track your progress
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {enrollments?.map((enrollment) => (
          <Card key={enrollment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col h-full">
                {/* Class Image */}
                <div className="aspect-video bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg mb-4 flex items-center justify-center">
                  {enrollment.class?.thumbnail_url ? (
                    <img 
                      src={enrollment.class.thumbnail_url} 
                      alt={enrollment.class.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-white text-center">
                      <div className="text-2xl font-bold mb-1">
                        {enrollment.class?.title?.charAt(0) || 'C'}
                      </div>
                      <div className="text-sm opacity-80">Class</div>
                    </div>
                  )}
                </div>

                {/* Class Info */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg leading-tight">
                      {enrollment.class?.title || 'Unknown Class'}
                    </h3>
                    <Badge className={getStatusColor(enrollment.status)}>
                      {enrollment.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {enrollment.class?.description || 'No description available'}
                  </p>

                  {/* Class Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-2" />
                      <span>Tutor: {enrollment.class?.tutor_name || 'Unknown'}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}</span>
                    </div>

                    {enrollment.class?.price && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-4 w-4 mr-2" />
                        <span>${enrollment.class.price} {enrollment.class.currency || 'USD'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewClass(enrollment.class_id)}
                    className="flex-1"
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    View Class
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMessageTutorClick(enrollment.class?.tutor_id || '', enrollment.class_id)}
                    disabled={isMessagingLoading}
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyClasses;
