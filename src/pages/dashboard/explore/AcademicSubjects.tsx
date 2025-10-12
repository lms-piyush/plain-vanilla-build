import PageLayout from "@/components/PageLayout";
import ClassCard from "@/components/ClassCard";
import MobileSearchBar from "@/components/MobileSearchBar";
import { useClassesBySubject } from "@/hooks/use-classes-by-subject";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/use-pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AcademicSubjects = () => {
  const { data: allClasses = [], isLoading } = useClassesBySubject([
    "Math",
    "Science",
    "STEM",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Geography",
    "Economics",
    "English",
    "Literature",
    "Writing"
  ]);

  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
  } = usePagination({ totalItems: allClasses.length, itemsPerPage: 12 });

  const paginatedClasses = allClasses.slice(startIndex, endIndex);

  return (
    <PageLayout
      title="Academic Subjects"
      description="Discover engaging classes in Math, Science, Language Arts, and more taught by expert educators for students of all ages."
    >
      <MobileSearchBar />
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-lg" />
          ))}
        </div>
      ) : allClasses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No academic subjects available at the moment.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedClasses.map((classItem) => (
              <ClassCard key={classItem.id} {...classItem} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={previousPage}
                disabled={!hasPreviousPage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                onClick={nextPage}
                disabled={!hasNextPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default AcademicSubjects;
