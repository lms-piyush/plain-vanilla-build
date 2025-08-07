
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StudentClassDetails } from "@/hooks/use-student-class-details";
import { enrollStudentInClass } from "@/hooks/use-student-enrollment";
import PaymentButton from "@/components/payment/PaymentButton";
import { usePaymentSuccess } from "@/hooks/use-payment-success";

interface ClassPurchaseSectionProps {
  classDetails: StudentClassDetails;
  onEnrollmentChange: () => void;
}

const ClassPurchaseSection = ({ classDetails, onEnrollmentChange }: ClassPurchaseSectionProps) => {
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Handle payment success from URL parameters
  usePaymentSuccess(onEnrollmentChange);

  const handleFreeEnrollment = async () => {
    if (classDetails?.isEnrolled && classDetails?.isCurrentBatch) {
      toast({
        title: "Already enrolled",
        description: "You are already enrolled in the current batch of this class.",
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

      // Use the existing enrollment function that includes notification logic
      await enrollStudentInClass(classDetails.id, user.id);

      console.log('Enrollment successful with notifications');
      
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

  const handlePaymentSuccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await enrollStudentInClass(classDetails.id, user.id);
        toast({
          title: "Payment successful!",
          description: "You have been enrolled in this class.",
        });
        onEnrollmentChange();
      }
    } catch (error: any) {
      console.error('Error enrolling after payment:', error);
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
      <div className="flex flex-col gap-2">
        {classDetails.isEnrolled && !classDetails.isCurrentBatch && (
          <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
            You are enrolled in batch {classDetails.enrolledBatch}. This class has been updated to batch {classDetails.batch_number}.
          </p>
        )}
        {classDetails.price && (typeof classDetails.price === 'string' ? parseFloat(classDetails.price) : classDetails.price) > 0 ? (
          <PaymentButton
            amount={Math.round((typeof classDetails.price === 'string' ? parseFloat(classDetails.price) : classDetails.price) * 100)} // Convert to paisa
            description={`Course: ${classDetails.title}`}
            className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
            classId={classDetails.id}
            onSuccess={handlePaymentSuccess}
          />
        ) : (
          <Button
            onClick={handleFreeEnrollment}
            disabled={isEnrolling || (classDetails.isEnrolled && classDetails.isCurrentBatch)}
            className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
          >
            {isEnrolling 
              ? "Enrolling..." 
              : classDetails.isEnrolled && classDetails.isCurrentBatch 
                ? "Already Enrolled" 
                : classDetails.isEnrolled && !classDetails.isCurrentBatch
                  ? "Enroll in New Batch"
                  : "Enroll Free"
            }
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClassPurchaseSection;
