
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/PageLayout";
import { useToast } from "@/hooks/use-toast";
import { getLectureTypeInfo } from "@/types/lecture-types";
import { supabase } from "@/integrations/supabase/client";
import { classData } from "@/data/classDetailsData";
import ClassHeader from "@/components/class-details/ClassHeader";
import OverviewTab from "@/components/class-details/OverviewTab";
import SyllabusTab from "@/components/class-details/SyllabusTab";
import ReviewsTab from "@/components/class-details/ReviewsTab";
import FAQTab from "@/components/class-details/FAQTab";
import ClassBookingCard from "@/components/class-details/ClassBookingCard";
import TutorInfoCard from "@/components/class-details/TutorInfoCard";

const ClassDetails = () => {
  const { classId } = useParams();
  const { toast } = useToast();
  const [isEnrolling, setIsEnrolling] = useState(false);
  
  const lectureTypeInfo = getLectureTypeInfo(classData.lectureType);
  const isOffline = classData.lectureType.startsWith("offline");
  const isRecorded = classData.lectureType === "online-recorded-group" || 
                    classData.lectureType === "online-recorded-one-on-one" || 
                    classData.lectureType === "recorded-on-demand";

  const handleEnrollClass = async () => {
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

      console.log('Attempting to enroll user:', user.id, 'in class:', classId);

      // Check if already enrolled
      const { data: existingEnrollment } = await supabase
        .from('student_enrollments')
        .select('id')
        .eq('student_id', user.id)
        .eq('class_id', classId)
        .maybeSingle();

      if (existingEnrollment) {
        toast({
          title: "Already enrolled",
          description: "You are already enrolled in this class.",
          variant: "destructive"
        });
        return;
      }

      // Create enrollment
      const { data, error } = await supabase
        .from('student_enrollments')
        .insert({
          student_id: user.id,
          class_id: classId,
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

  return (
    <PageLayout
      title={classData.title}
      description={classData.subtitle}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ClassHeader 
            image={classData.image}
            title={classData.title}
            lectureType={classData.lectureType}
          />
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="syllabus" className="flex-1">Syllabus</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
              <TabsTrigger value="faqs" className="flex-1">FAQs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <OverviewTab 
                description={classData.description}
                lectureType={classData.lectureType}
                location={classData.location}
                learningObjectives={classData.learningObjectives}
                requirements={classData.requirements}
              />
            </TabsContent>
            
            <TabsContent value="syllabus" className="space-y-4">
              <SyllabusTab syllabus={classData.syllabus} />
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-4">
              <ReviewsTab 
                rating={classData.rating}
                reviewCount={classData.reviewCount}
                reviews={classData.reviews}
              />
            </TabsContent>
            
            <TabsContent value="faqs" className="space-y-4">
              <FAQTab faqs={classData.faqs} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <ClassBookingCard 
            price={classData.price}
            priceInterval={classData.priceInterval}
            startDate={isRecorded ? undefined : classData.startDate}
            schedule={isRecorded ? undefined : classData.schedule}
            spotsAvailable={classData.spotsAvailable}
            totalSpots={classData.totalSpots}
            location={isOffline ? classData.location : undefined}
            category={classData.category}
            level={classData.level}
            ageRange={classData.ageRange}
            lectureType={classData.lectureType}
            isRecorded={isRecorded}
            isEnrolling={isEnrolling}
            onEnroll={handleEnrollClass}
          />
          
          <TutorInfoCard tutor={classData.tutor} />
        </div>
      </div>
    </PageLayout>
  );
};

export default ClassDetails;
