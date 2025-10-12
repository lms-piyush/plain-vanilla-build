import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ArrowUpDown, Heart, Users, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/DashboardLayout";
import { useWishlist } from "@/hooks/use-wishlist";
import { LectureType } from "@/types/lecture-types";

const SavedClasses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { wishlist, isLoading, removeFromWishlist } = useWishlist();

  const filteredClasses = wishlist.filter((item: any) => {
    const cls = item.classes;
    if (!cls) return false;
    const searchLower = searchQuery.toLowerCase();
    return (
      cls.title?.toLowerCase().includes(searchLower) ||
      cls.subject?.toLowerCase().includes(searchLower) ||
      cls.description?.toLowerCase().includes(searchLower) ||
      cls.profiles?.full_name?.toLowerCase().includes(searchLower)
    );
  });

  const getDeterminedLectureType = (classItem: any): LectureType => {
    if (classItem.delivery_mode === "online") {
      if (classItem.class_size === "one-on-one") {
        return "live-one-on-one";
      } else if (classItem.class_format === "recorded") {
        return "recorded-on-demand";
      } else {
        return "live-group";
      }
    } else {
      return "offline-student-travels";
    }
  };

  const getAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc: number, review: any) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Saved Classes</h1>
            <p className="text-muted-foreground">
              Classes you've saved for later
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search saved classes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3">
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? "No saved classes match your search."
                        : "You haven't saved any classes yet."}
                    </p>
                    <Button asChild className="mt-4">
                      <Link to="/student/explore">Explore Classes</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              filteredClasses.map((item: any) => {
                const cls = item.classes;
                const avgRating = getAverageRating(cls.class_reviews);
                const timeSlot = cls.class_time_slots?.[0];
                const nextDate = timeSlot
                  ? `${timeSlot.day_of_week} at ${timeSlot.start_time}`
                  : "Available soon";

                return (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative">
                      <div className="aspect-video w-full">
                        <img
                          src={
                            cls.thumbnail_url ||
                            "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&w=800&h=500&fit=crop"
                          }
                          alt={cls.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full"
                        onClick={() => removeFromWishlist(cls.id)}
                      >
                        <Heart className="h-4 w-4 fill-primary text-primary" />
                        <span className="sr-only">Remove from saved</span>
                      </Button>
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between">
                        <Badge variant="outline">{cls.subject || "General"}</Badge>
                        <div className="flex items-center text-sm">
                          <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                          <span>{avgRating}</span>
                          <span className="text-muted-foreground ml-1">
                            ({cls.class_reviews?.length || 0})
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-2">{cls.title}</CardTitle>
                      <CardDescription>
                        {cls.profiles?.full_name || "Unknown Tutor"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {cls.description || "No description available"}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{nextDate}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{cls.max_students || 0} max students</span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="font-bold">${cls.price || 0}</div>
                        <Button size="sm" asChild>
                          <Link to={`/student/classes/${cls.id}`}>View Class</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedClasses;
