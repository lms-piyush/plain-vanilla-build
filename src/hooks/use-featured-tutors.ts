import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LectureType } from "@/types/lecture-types";

export interface FeaturedTutor {
  id: number;
  name: string;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  students: number;
  classes: number;
  offeredLectureTypes: LectureType[];
  featuredClass: {
    id: string;
    title: string;
    price: number;
    duration: number;
    nextAvailable: string;
    lectureType: LectureType;
  };
}

export const useFeaturedTutors = () => {
  const [tutors, setTutors] = useState<FeaturedTutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const { data: tutorProfiles, error } = await supabase
          .from("profiles")
          .select(`
            *,
            classes!classes_tutor_id_fkey (
              *,
              class_reviews (rating),
              student_enrollments (student_id),
              class_time_slots (day_of_week, start_time)
            )
          `)
          .eq("role", "tutor")
          .limit(8);

        if (error) throw error;

        const transformedTutors: FeaturedTutor[] = (tutorProfiles || []).map((tutor: any, index: number) => {
          const tutorClasses = tutor.classes || [];
          const activeClasses = tutorClasses.filter((c: any) => c.status === "active");
          
          // Calculate stats
          const allReviews = tutorClasses.flatMap((c: any) => c.class_reviews || []);
          const avgRating = allReviews.length > 0
            ? allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length
            : 0;
          
          const uniqueStudents = new Set(
            tutorClasses.flatMap((c: any) => (c.student_enrollments || []).map((e: any) => e.student_id))
          );

          // Get featured class (first active class)
          const featuredClass = activeClasses[0] || tutorClasses[0];
          const timeSlot = featuredClass?.class_time_slots?.[0];
          
          // Determine lecture types offered
          const lectureTypes = new Set<LectureType>();
          tutorClasses.forEach((c: any) => {
            if (c.delivery_mode === "online") {
              if (c.class_size === "one-on-one") {
                lectureTypes.add("live-one-on-one");
              } else if (c.class_format === "recorded") {
                lectureTypes.add("recorded-on-demand");
              } else {
                lectureTypes.add("live-group");
              }
            } else {
              lectureTypes.add("offline-student-travels");
            }
          });

          return {
            id: index + 1,
            name: tutor.full_name || "Tutor",
            title: tutor.bio?.substring(0, 50) || "Expert Tutor",
            image: tutor.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + tutor.id,
            rating: Math.round(avgRating * 10) / 10,
            reviews: allReviews.length,
            students: uniqueStudents.size,
            classes: activeClasses.length,
            offeredLectureTypes: Array.from(lectureTypes),
            featuredClass: featuredClass ? {
              id: featuredClass.id,
              title: featuredClass.title,
              price: Number(featuredClass.price) || 0,
              duration: 60,
              nextAvailable: timeSlot ? `${timeSlot.day_of_week} at ${timeSlot.start_time}` : "Available soon",
              lectureType: Array.from(lectureTypes)[0] || "live-group"
            } : {
              id: "",
              title: "No classes yet",
              price: 0,
              duration: 0,
              nextAvailable: "",
              lectureType: "live-group"
            }
          };
        });

        setTutors(transformedTutors.filter(t => t.classes > 0));
      } catch (error) {
        console.error("Error fetching featured tutors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutors();
  }, []);

  return { tutors, isLoading };
};
