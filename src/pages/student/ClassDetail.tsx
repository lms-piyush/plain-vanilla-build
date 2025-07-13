
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useStudentClassDetails } from "@/hooks/use-student-class-details";
import ClassDetailHeader from "@/components/student/class-details/ClassDetailHeader";
import ClassPurchaseSection from "@/components/student/class-details/ClassPurchaseSection";
import ClassTabs from "@/components/student/class-details/ClassTabs";

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { classDetails, isLoading, error, refetch, reviewStats } = useStudentClassDetails(id || '');

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

  // Restrict access if student is enrolled in an outdated batch
  if (classDetails.isEnrolled && !classDetails.isCurrentBatch) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <ClassDetailHeader 
          classDetails={classDetails} 
          averageRating={reviewStats.average_rating}
          totalReviews={reviewStats.total_reviews}
        />
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">
            Class Updated - Re-enrollment Required
          </h2>
          <p className="text-amber-700 mb-4">
            You are enrolled in batch {classDetails.enrolledBatch}, but this class has been updated to batch {classDetails.batch_number}. 
            To access the latest content, lessons, and materials, please re-enroll in the new batch.
          </p>
          <ClassPurchaseSection classDetails={classDetails} onEnrollmentChange={refetch} />
        </div>
      </div>
    );
  }

  return (
    <>
      <ClassDetailHeader 
        classDetails={classDetails} 
        averageRating={reviewStats.average_rating}
        totalReviews={reviewStats.total_reviews}
      />

      <ClassPurchaseSection classDetails={classDetails} onEnrollmentChange={refetch} />

      <ClassTabs classDetails={classDetails} classId={id || ''} />
    </>
  );
};

export default ClassDetail;
