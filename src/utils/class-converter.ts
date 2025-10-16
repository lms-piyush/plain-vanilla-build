
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

  const getAgeRange = () => {
    if (tutorClass.age_range_min && tutorClass.age_range_max) {
      return `${tutorClass.age_range_min}-${tutorClass.age_range_max} years`;
    }
    return "All ages";
  };

  const getDuration = () => {
    if (tutorClass.duration_minutes) {
      return `${tutorClass.duration_minutes} min`;
    }
    return "60 min";
  };

  const getSchedule = () => {
    if (tutorClass.schedule_type) {
      return tutorClass.schedule_type;
    }
    if (tutorClass.duration_type === 'recurring') {
      return "Weekly • Flexible schedule";
    }
    return "One-time class";
  };

  const spotsLeft = tutorClass.max_students && tutorClass.student_count !== undefined
    ? tutorClass.max_students - tutorClass.student_count
    : undefined;

  return {
    id: tutorClass.id,
    title: tutorClass.title,
    tutor: tutorClass.tutor_name || "Unknown Tutor",
    tutorId: tutorClass.tutor_id,
    tutorAvatar: tutorClass.tutor_avatar,
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
    wishListed: wishlistedCourses.includes(tutorClass.id),
    ageRange: getAgeRange(),
    duration: getDuration(),
    schedule: getSchedule(),
    spotsLeft: spotsLeft
  };
};
