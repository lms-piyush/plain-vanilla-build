
import { useState } from "react";
import { Search, MessageSquare, Calendar, Clock, Users, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStudentEnrollments } from "@/hooks/use-student-enrollments";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentMessages } from "@/hooks/use-student-messages";
import { useToast } from "@/hooks/use-toast";

const MyClasses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: enrolledClasses = [], isLoading, error } = useStudentEnrollments(user?.id || "");
  const { handleCreateConversation } = useStudentMessages(user?.id || "");

  // Filter classes based on search
  const filteredClasses = enrolledClasses.filter(enrollment => 
    enrollment.classes?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.tutor_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMessageTutor = async (tutorId: string, classId: string) => {
    try {
      await handleCreateConversation(tutorId, classId);
      // Redirect to messages page or show success
      toast({
        title: "Conversation started",
        description: "You can now message your tutor in the Messages section",
      });
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Loading your classes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">Error loading classes: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-600 mt-2">Track your enrolled classes and communicate with tutors</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search your classes..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Classes Grid */}
      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((enrollment) => {
            const classData = enrollment.classes;
            if (!classData) return null;
            
            return (
              <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 relative">
                  {classData.thumbnail_url && (
                    <img 
                      src={classData.thumbnail_url} 
                      alt={classData.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-900">
                      {enrollment.status}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg line-clamp-2">{classData.title}</h3>
                    <div className="flex items-center ml-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600 ml-1">4.8</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {classData.description}
                  </p>

                  {/* Tutor Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-purple-100 text-purple-800">
                        {enrollment.tutor_name?.split(" ").map(n => n[0]).join("") || "T"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{enrollment.tutor_name}</p>
                      <p className="text-xs text-gray-500">Instructor</p>
                    </div>
                  </div>

                  {/* Class Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{classData.delivery_mode} • {classData.class_size}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>Max {classData.max_students || 'Unlimited'} students</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-lg font-bold text-gray-900">
                      {classData.currency || 'USD'} {classData.price || 0}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleMessageTutor(classData.tutor_id, classData.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message Tutor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No classes yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't enrolled in any classes yet. Explore our available classes to get started!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClasses;
