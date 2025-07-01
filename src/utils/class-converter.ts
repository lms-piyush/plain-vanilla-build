
import { TutorClassWithReviews } from "@/hooks/use-all-classes-with-reviews";

export const convertToClassCard = (tutorClass: TutorClassWithReviews, wishlistedCourses: string[]) => {
  const getClassMode = () => {
    return tutorClass.delivery_mode === 'online' ? 'Online' : 'Offline';
  };

  const getClassFormat = () => {
    switch (tutorClass.class_format) {
      case 'live': return 'Live';
      case 'recorded': return 'Recorded';
      case 'inbound': return 'Inbound';
      case 'outbound': return 'Outbound';
      default: return 'Live';
    }
  };

  const getClassSize = () => {
    return tutorClass.class_size === 'group' ? 'Group' : '1-on-1';
  };

  return {
    id: tutorClass.id,
    title: tutorClass.title,
    tutor: tutorClass.tutor_name || "Unknown Tutor",
    tutorId: tutorClass.tutor_id,
    rating: tutorClass.average_rating || 0,
    reviewCount: tutorClass.total_reviews || 0,
    image: tutorClass.thumbnail_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300",
    description: tutorClass.description || "",
    mode: getClassMode(),
    format: getClassFormat(),
    classSize: getClassSize(),
    students: tutorClass.student_count || 0,
    maxStudents: tutorClass.max_students || 0,
    price: tutorClass.price ? `Rs. ${tutorClass.price}` : "Free",
    isSubscription: tutorClass.duration_type === 'recurring',
    wishListed: wishlistedCourses.includes(tutorClass.id)
  };
};
