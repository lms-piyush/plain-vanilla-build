
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StudentClassDetails } from "@/hooks/use-student-class-details";

interface ClassPurchaseSectionProps {
  classDetails: StudentClassDetails;
  onEnrollmentChange: () => void;
}

const ClassPurchaseSection = ({ classDetails, onEnrollmentChange }: ClassPurchaseSectionProps) => {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handlePurchase = async () => {
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

      console.log('Attempting to enroll user:', user.id, 'in class:', classDetails.id);

      // Create enrollment
      const { data, error } = await supabase
        .from('student_enrollments')
        .insert({
          student_id: user.id,
          class_id: classDetails.id,
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

      // Trigger refetch of class details
      onEnrollmentChange();

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
  );
};

export default ClassPurchaseSection;
