import PageLayout from "@/components/PageLayout";
import ClassCard from "@/components/ClassCard";
import MobileSearchBar from "@/components/MobileSearchBar";
import { useClassesBySubject } from "@/hooks/use-classes-by-subject";
import { Skeleton } from "@/components/ui/skeleton";

const LifeSkills = () => {
  const { data: classes = [], isLoading } = useClassesBySubject([
    "Life Skills",
    "Leadership",
    "Communication",
    "Public Speaking",
    "Debate",
    "Time Management",
    "Financial Literacy",
    "Social Skills",
    "Entrepreneurship"
  ]);

  return (
    <PageLayout
      title="Life Skills & Personal Development"
      description="Build essential life skills through classes in leadership, communication, financial literacy, and more."
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
          <p className="text-muted-foreground">No life skills classes available at the moment.</p>
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

export default LifeSkills;
