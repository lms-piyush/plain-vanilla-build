
import { StudentEnrollmentWithReviews } from "@/hooks/use-student-enrollments-with-reviews";

export const convertEnrollmentToClassCard = (enrollment: StudentEnrollmentWithReviews) => {
  const classData = enrollment.class;
  
  // Determine class type and format from real database data
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
    // Map real enrollment and class status to display status
    if (enrollment.status === 'completed' || classData.status === 'completed') {
      return 'Completed';
    }
    if (enrollment.status === 'cancelled') {
      return 'Cancelled';
    }
    if (enrollment.status === 'active' && (classData.status === 'active' || classData.status === 'running')) {
      return 'Active';
    }
    if (enrollment.status === 'active' && classData.status === 'draft') {
      return 'Enrolled';
    }
    return 'Enrolled';
  };

  // Get frequency information from real class schedules data
  const getFrequency = () => {
    if (classData.class_schedules && classData.class_schedules.length > 0) {
      const schedule = classData.class_schedules[0];
      return schedule.frequency || 'Weekly';
    }
    return 'Weekly';
  };

  // Use real data from database, no dummy data
  return {
    id: classData.id,
    title: classData.title || 'Untitled Class',
    tutor: classData.tutor_name || 'Unknown Tutor',
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
    students: classData.student_count || 0,
    description: classData.description || "No description available",
    price: classData.price || 0,
    enrollmentDate: enrollment.enrollment_date,
    frequency: getFrequency(),
    maxStudents: classData.max_students || 0,
    subject: classData.subject || 'General'
  };
};
