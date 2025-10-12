import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LectureType } from "@/types/lecture-types";

export interface FeaturedClass {
  classId: string;
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
  location?: string;
  isFeatured: boolean;
  ageRange: string;
}

export const useFeaturedClasses = () => {
  const [classes, setClasses] = useState<FeaturedClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
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
            ),
            class_locations (
              meeting_link,
              street,
              city
            )
          `)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(8);

        if (error) throw error;

        const transformedClasses: FeaturedClass[] = (data || []).map((classItem: any) => {
          const reviews = classItem.class_reviews || [];
          const avgRating = reviews.length > 0
            ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
            : 0;

          const timeSlot = classItem.class_time_slots?.[0];
          const location = classItem.class_locations?.[0];
          
          let nextDate = "Available soon";
          if (timeSlot) {
            nextDate = `${timeSlot.day_of_week} at ${timeSlot.start_time}`;
          }

          const tutorName = classItem.profiles?.full_name || "Unknown Tutor";

          // Determine lecture type based on delivery_mode and class_format
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
            classId: classItem.id,
            title: classItem.title,
            image: classItem.thumbnail_url || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&w=800&h=500&fit=crop",
            tutor: tutorName,
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: reviews.length,
            price: Number(classItem.price) || 0,
            duration: 60, // Default duration
            nextDate,
            tags: [classItem.subject || "General", classItem.class_size === "one-on-one" ? "1-on-1" : "Group"],
            lectureType,
            location: location?.city || location?.meeting_link || undefined,
            isFeatured: true,
            ageRange: "7-16"
          };
        });

        setClasses(transformedClasses);
      } catch (error) {
        console.error("Error fetching featured classes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return { classes, isLoading };
};
