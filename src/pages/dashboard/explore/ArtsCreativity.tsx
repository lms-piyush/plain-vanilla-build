import PageLayout from "@/components/PageLayout";
import ClassCard from "@/components/ClassCard";
import MobileSearchBar from "@/components/MobileSearchBar";
import { useClassesBySubject } from "@/hooks/use-classes-by-subject";
import { Skeleton } from "@/components/ui/skeleton";

const ArtsCreativity = () => {
  const { data: classes = [], isLoading } = useClassesBySubject([
    "Arts",
    "Music",
    "Dance",
    "Drama",
    "Theater",
    "Drawing",
    "Painting",
    "Photography",
    "Design",
    "Creative Writing"
  ]);

  return (
    <PageLayout
      title="Arts & Creativity"
      description="Explore creative classes in art, music, dance, drama, and more. Unleash your child's artistic potential with expert instructors."
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
          <p className="text-muted-foreground">No arts & creativity classes available at the moment.</p>
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

export default ArtsCreativity;
