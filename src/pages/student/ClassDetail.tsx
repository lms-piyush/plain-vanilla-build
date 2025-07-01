
import React from "react";
import { useParams } from "react-router-dom";
import { useStudentClassDetails } from "@/hooks/use-student-class-details";
import ClassDetailHeader from "@/components/student/class-details/ClassDetailHeader";
import ClassTabs from "@/components/student/class-details/ClassTabs";
import ClassPurchaseSection from "@/components/student/class-details/ClassPurchaseSection";

const ClassDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>Class not found</div>;
  }

  const { 
    classDetails, 
    isLoading, 
    error,
    reviewStats,
    refetch
  } = useStudentClassDetails(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !classDetails) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading class details</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <ClassDetailHeader
        title={classDetails.title}
        tutor={classDetails.profiles?.full_name || classDetails.tutor_name || "Unknown Tutor"}
        deliveryMode={classDetails.delivery_mode}
        classFormat={classDetails.class_format}
        classSize={classDetails.class_size}
        studentCount={classDetails.student_count || 0}
        averageRating={reviewStats.averageRating}
        totalReviews={reviewStats.totalReviews}
        price={classDetails.price || undefined}
        currency={classDetails.currency || undefined}
        thumbnailUrl={classDetails.thumbnail_url || undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ClassTabs
            classDetails={classDetails}
            classId={id}
          />
        </div>
        
        <div className="lg:col-span-1">
          <ClassPurchaseSection
            classDetails={classDetails}
            onEnrollmentChange={refetch}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;
