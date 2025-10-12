import PageLayout from "@/components/PageLayout";
import ClassCard from "@/components/ClassCard";
import MobileSearchBar from "@/components/MobileSearchBar";
import { useClassesBySubject } from "@/hooks/use-classes-by-subject";
import { Skeleton } from "@/components/ui/skeleton";

const TechnologyCoding = () => {
  const { data: classes = [], isLoading } = useClassesBySubject([
    "Technology",
    "Coding",
    "Programming",
    "Web Development",
    "App Development",
    "Game Development",
    "Robotics",
    "AI",
    "Machine Learning",
    "Data Science"
  ]);

  return (
    <PageLayout
      title="Technology & Coding"
      description="Dive into the world of technology with coding, robotics, web development, and more. Prepare for the future with hands-on tech skills."
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
          <p className="text-muted-foreground">No technology & coding classes available at the moment.</p>
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

export default TechnologyCoding;
