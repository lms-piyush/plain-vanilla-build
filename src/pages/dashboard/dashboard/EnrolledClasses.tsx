import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/DashboardLayout";
import ClassesHeader from "@/components/dashboard/ClassesHeader";
import ClassList from "@/components/dashboard/ClassList";
import { useStudentEnrollmentsWithReviews } from "@/hooks/use-student-enrollments-with-reviews";
import { ClassCardProps } from "@/components/dashboard/ClassCard";

const EnrolledClasses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: enrollments = [], isLoading } = useStudentEnrollmentsWithReviews();

  // Convert enrollments to ClassCardProps format
  const convertToClassCardProps = (enrollment: any): ClassCardProps => {
    const cls = enrollment.classes;
    return {
      id: cls.id.toString(),
      title: cls.title,
      tutor: cls.tutor_name || "Unknown Tutor",
      image: cls.thumbnail_url || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&w=800&h=500&fit=crop",
      nextSession: "Upcoming",
      progress: "0%",
      category: cls.subject || "General",
      status: enrollment.status === "active" ? "active" : "completed",
      completionDate: enrollment.status !== "active" ? enrollment.updated_at : undefined,
      classType: cls.delivery_mode as "online" | "offline",
      format: cls.class_format as "live" | "recorded",
      classSize: cls.class_size === "one-on-one" ? "individual" : "group",
      duration: "fixed" as const,
      studentsCount: cls.max_students || 0,
    };
  };

  // Filter classes by search query and status
  const filterClasses = (status: string) => {
    return enrollments
      .filter((enrollment: any) => {
        const cls = enrollment.classes;
        const matchesStatus = enrollment.status === status;
        const matchesSearch =
          !searchQuery ||
          cls.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cls.tutor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cls.subject?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      })
      .map(convertToClassCardProps);
  };

  const activeClasses = filterClasses("active");
  const completedClasses = filterClasses("completed");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ClassesHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">
                Active Classes{" "}
                <Badge className="ml-2" variant="secondary">
                  {activeClasses.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed{" "}
                <Badge className="ml-2" variant="secondary">
                  {completedClasses.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              <ClassList
                classes={activeClasses}
                emptyStateMessage="No active classes found."
                showFindClassesButton
              />
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <ClassList
                classes={completedClasses}
                emptyStateMessage="No completed classes yet."
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EnrolledClasses;
