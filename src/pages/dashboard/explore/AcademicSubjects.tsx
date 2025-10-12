import PageLayout from "@/components/PageLayout";
import ClassCard from "@/components/ClassCard";
import MobileSearchBar from "@/components/MobileSearchBar";
import { useClassesBySubject } from "@/hooks/use-classes-by-subject";
import { Skeleton } from "@/components/ui/skeleton";

const AcademicSubjects = () => {
  const { data: classes = [], isLoading } = useClassesBySubject([
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
      ) : classes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No academic subjects available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <ClassCard key={classItem.id} {...classItem} />
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default AcademicSubjects;
