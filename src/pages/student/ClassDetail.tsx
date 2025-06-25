
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Star, MapPin, User, Calendar, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStudentClassDetails } from "@/hooks/use-student-class-details";
import LessonsTab from "@/components/student/class-details/LessonsTab";
import ResourcesTab from "@/components/student/class-details/ResourcesTab";
import ReviewsTab from "@/components/student/class-details/ReviewsTab";

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEnrolling, setIsEnrolling] = useState(false);
  
  const { classDetails, isLoading, error, refetch } = useStudentClassDetails(id || '');

  const handlePurchase = async () => {
    if (!id) return;
    
    if (classDetails?.isEnrolled) {
      toast({
        title: "Already enrolled",
        description: "You are already enrolled in this class.",
      });
      return;
    }

    setIsEnrolling(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to enroll in a class.",
          variant: "destructive"
        });
        return;
      }

      console.log('Attempting to enroll user:', user.id, 'in class:', id);

      // Create enrollment
      const { data, error } = await supabase
        .from('student_enrollments')
        .insert({
          student_id: user.id,
          class_id: id,
          status: 'active',
          payment_status: 'paid'
        })
        .select();

      if (error) {
        console.error('Enrollment error:', error);
        throw error;
      }

      console.log('Enrollment successful:', data);
      
      toast({
        title: "Successfully enrolled!",
        description: "You have been enrolled in this class. Check your enrolled classes to get started.",
      });

      // Refetch class details to update enrollment status
      refetch();

    } catch (error: any) {
      console.error('Error enrolling in class:', error);
      toast({
        title: "Enrollment failed",
        description: error.message || "There was an error enrolling in this class. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEnrolling(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8A5BB7]"></div>
      </div>
    );
  }

  if (error || !classDetails) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Class Not Found</h1>
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mb-4"
        >
          Back
        </Button>
      </div>
      
      {/* Course Header Section */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
        <div className="relative aspect-video">
          <img
            src={classDetails.thumbnail_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800"}
            alt={classDetails.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6">
          {/* Course Title */}
          <h1 className="text-2xl font-bold mb-4">{classDetails.title}</h1>
          
          {/* Course Info Bar */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4">
            {/* Tutor */}
            <button 
              className="text-base font-medium text-[#8A5BB7] hover:underline flex items-center"
              onClick={() => navigate(`/tutor/${classDetails.tutor_id}`)}
            >
              <User className="mr-1 h-4 w-4" />
              {classDetails.tutor_name}
            </button>
            
            {/* Rating - dummy data */}
            <div className="flex items-center">
              <Star className="fill-yellow-400 stroke-yellow-400 h-4 w-4 mr-1" />
              <span className="text-sm font-medium">4.8</span>
              <span className="text-sm text-gray-500 ml-1">(128 reviews)</span>
            </div>
            
            {/* Class Size */}
            <div className="text-sm">
              {classDetails.class_size === "group" ? 
                `${classDetails.max_students || 40} students` : 
                <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">1-on-1</span>
              }
            </div>
          </div>
          
          {/* Course Overview */}
          <div className="text-gray-700 mb-6">
            {classDetails.description || "This course provides comprehensive learning experience with hands-on practice and expert guidance."}
          </div>
          
          {/* Course Attributes */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-2 py-1 rounded-full bg-[#E5D0FF] text-xs text-[#8A5BB7]">
              {classDetails.delivery_mode === 'online' ? 'Online' : 'Offline'}
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">
              {classDetails.class_format}
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">
              {classDetails.class_size === "group" ? `${classDetails.max_students || 40} students` : "1-on-1"}
            </span>
          </div>
          
          {/* Price and Purchase Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
            <div>
              <span className="text-xl font-bold text-[#8A5BB7]">
                {classDetails.price ? `${classDetails.currency || 'USD'} ${classDetails.price}` : 'Free'}
                {classDetails.duration_type === 'recurring' && <span className="text-sm font-normal">/month</span>}
              </span>
            </div>
            <Button
              onClick={handlePurchase}
              disabled={isEnrolling || classDetails.isEnrolled}
              className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
            >
              {isEnrolling ? "Enrolling..." : classDetails.isEnrolled ? "Already Enrolled" : "Purchase Course"}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Course Content Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <Tabs defaultValue={classDetails.isEnrolled ? "lessons" : "reviews"} className="w-full">
          <div className="px-6 pt-4 border-b">
            <TabsList className="w-full justify-start">
              {classDetails.isEnrolled && (
                <>
                  <TabsTrigger value="lessons" className="flex-1 sm:flex-none">Lessons</TabsTrigger>
                  <TabsTrigger value="resources" className="flex-1 sm:flex-none">Resources</TabsTrigger>
                </>
              )}
              <TabsTrigger value="reviews" className="flex-1 sm:flex-none">Reviews</TabsTrigger>
            </TabsList>
          </div>
          
          {classDetails.isEnrolled && (
            <>
              <TabsContent value="lessons" className="p-6">
                <LessonsTab classDetails={classDetails} />
              </TabsContent>
              
              <TabsContent value="resources" className="p-6">
                <ResourcesTab classDetails={classDetails} />
              </TabsContent>
            </>
          )}
          
          <TabsContent value="reviews" className="p-6">
            <ReviewsTab classId={id || ''} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ClassDetail;
