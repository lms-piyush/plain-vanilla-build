
import React, { useState } from "react";
import TutorDashboardLayout from "@/components/TutorDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTutorFeedback } from "@/hooks/use-tutor-feedback";
import FeedbackCard from "@/components/tutor/FeedbackCard";

const Feedback = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: feedbackData, isLoading, error } = useTutorFeedback(currentPage);

  const totalPages = feedbackData ? Math.ceil(feedbackData.totalCount / 2) : 0;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <TutorDashboardLayout>
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </TutorDashboardLayout>
    );
  }

  if (error) {
    return (
      <TutorDashboardLayout>
        <div className="container mx-auto py-6">
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Error loading feedback</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </TutorDashboardLayout>
    );
  }

  return (
    <TutorDashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Student Feedback</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Student Reviews & Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            {!feedbackData?.reviews.length ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No feedback received yet.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {feedbackData.reviews.map((feedback) => (
                    <FeedbackCard key={feedback.id} feedback={feedback} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </TutorDashboardLayout>
  );
};

export default Feedback;
