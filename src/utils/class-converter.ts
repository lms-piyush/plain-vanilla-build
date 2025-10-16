
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
    // For now, return a default age range. This will be replaced with actual data later
    return "7-16";
  };

  const getDuration = () => {
    // Default duration, will be replaced with actual data
    return "60 Min";
  };

  const getSchedule = () => {
    // Build schedule string from available data
    if (tutorClass.duration_type === 'recurring') {
      return "Weekly classes • Flexible schedule";
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
    tutorAvatar: undefined, // Will be populated when we add profile data
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
