
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

  const { classDetails, isLoading, error, refetch } = useStudentClassDetails(id || '');

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
      <ClassDetailHeader classDetails={classDetails} />

      <ClassPurchaseSection classDetails={classDetails} onEnrollmentChange={refetch} />

      <ClassTabs classDetails={classDetails} classId={id || ''} />
    </>
  );
};

export default ClassDetail;
