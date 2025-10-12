import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import TutorCard from "@/components/TutorCard";
import { useFeaturedTutors } from "@/hooks/use-featured-tutors";
import { Skeleton } from "@/components/ui/skeleton";
import { LectureType } from "@/types/lecture-types";

const ExploreTutors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: tutors, isLoading } = useFeaturedTutors();

  const filteredTutors = tutors?.filter((tutor) =>
    tutor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header Section */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Our Tutors
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Learn from passionate experts who are dedicated to helping students excel
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tutors by name or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tutors Grid */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredTutors && filteredTutors.length > 0 ? (
          <>
            <div className="mb-6 text-center">
              <p className="text-muted-foreground">
                Showing {filteredTutors.length} {filteredTutors.length === 1 ? 'tutor' : 'tutors'}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTutors.map((tutor) => (
                <TutorCard 
                  key={tutor.id} 
                  tutor={{
                    id: Number(tutor.id),
                    name: tutor.full_name || 'Unknown',
                    title: tutor.bio || '',
                    image: tutor.avatar_url || '/placeholder.svg',
                    rating: tutor.average_rating || 0,
                    reviews: 0,
                    students: tutor.total_students || 0,
                    classes: tutor.total_classes || 0,
                    offeredLectureTypes: []
                  }} 
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No tutors found matching your search
            </p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreTutors;
