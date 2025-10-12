import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LectureType } from "@/types/lecture-types";

export interface ClassBySubject {
  id: string;
  classId: string;
  className: string;
  title: string;
  image: string;
  tutor: string;
  rating: number;
  reviewCount: number;
  price: number;
  duration: number;
  nextDate: string;
  tags: string[];
  lectureType: LectureType;
  ageRange: string;
  isFeatured: boolean;
}

export const useClassesBySubject = (subjects: string[]) => {
  return useQuery({
    queryKey: ["classes-by-subject", subjects],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classes")
        .select(`
          *,
          profiles!classes_tutor_id_fkey (
            full_name
          ),
          class_reviews (
            rating
          ),
          class_time_slots (
            day_of_week,
            start_time
          )
        `)
        .eq("status", "active")
        .in("subject", subjects)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const transformedClasses: ClassBySubject[] = (data || []).map((classItem: any) => {
        const reviews = classItem.class_reviews || [];
        const avgRating = reviews.length > 0
          ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
          : 0;

        const timeSlot = classItem.class_time_slots?.[0];
        let nextDate = "Available soon";
        if (timeSlot) {
          nextDate = `${timeSlot.day_of_week} at ${timeSlot.start_time}`;
        }

        const tutorName = classItem.profiles?.full_name || "Unknown Tutor";

        let lectureType: LectureType = "live-group";
        if (classItem.delivery_mode === "online") {
          if (classItem.class_size === "one-on-one") {
            lectureType = "live-one-on-one";
          } else if (classItem.class_format === "recorded") {
            lectureType = "recorded-on-demand";
          } else {
            lectureType = "live-group";
          }
        } else {
          lectureType = "offline-student-travels";
        }

        return {
          id: classItem.id,
          classId: classItem.id,
          className: classItem.subject || "General",
          title: classItem.title,
          image: classItem.thumbnail_url || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&w=800&h=500&fit=crop",
          tutor: tutorName,
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length,
          price: Number(classItem.price) || 0,
          duration: 60,
          nextDate,
          tags: [classItem.subject || "General", classItem.class_size === "one-on-one" ? "1-on-1" : "Group"],
          lectureType,
          ageRange: "7-16",
          isFeatured: false,
        };
      });

      return transformedClasses;
    },
    staleTime: 5 * 60 * 1000,
  });
};
