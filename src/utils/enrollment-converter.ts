
import { StudentEnrollmentWithReviews } from "@/hooks/use-student-enrollments-with-reviews";

export const convertEnrollmentToClassCard = (enrollment: StudentEnrollmentWithReviews) => {
  const classData = enrollment.class;
  
  // Determine class type and format
  const getClassMode = () => {
    return classData.delivery_mode === 'online' ? 'Online' : 'Offline';
  };

  const getClassFormat = () => {
    switch (classData.class_format) {
      case 'live': return 'Live';
      case 'recorded': return 'Recorded';  
      case 'inbound': return 'Inbound';
      case 'outbound': return 'Outbound';
      default: return 'Live';
    }
  };

  const getClassSize = () => {
    return classData.class_size === 'group' ? 'Group' : '1-on-1';
  };

  const getPaymentType = () => {
    return classData.duration_type === 'recurring' ? 'Subscription' : 'One-time';
  };

  const getStatus = () => {
    switch (enrollment.status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Enrolled';
    }
  };

  return {
    id: classData.id,
    title: classData.title,
    tutor: classData.tutor_name,
    tutorId: classData.tutor_id,
    image: classData.thumbnail_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300",
    type: getClassMode(),
    format: getClassFormat(),
    classSize: getClassSize(),
    payment: getPaymentType(),
    status: getStatus(),
    rating: classData.average_rating || 0,
    reviewCount: classData.total_reviews || 0,
    studentCount: classData.student_count || 0,
    price: classData.price || 0,
    enrollmentDate: enrollment.enrollment_date
  };
};
