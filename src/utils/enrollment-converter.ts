
import { StudentEnrollment } from "@/hooks/use-student-enrollments";

export const convertEnrollmentToClassCard = (enrollment: StudentEnrollment) => {
  const cls = enrollment.class;
  return {
    id: cls.id,
    title: cls.title,
    tutor: cls.tutor_name,
    tutorId: cls.tutor_id,
    type: cls.delivery_mode === 'online' ? 'Online' : 'Offline',
    format: cls.class_format.charAt(0).toUpperCase() + cls.class_format.slice(1),
    payment: cls.duration_type === 'recurring' ? 'Subscription' : 'Fixed',
    status: enrollment.status === 'active' ? 'Active' : enrollment.status === 'completed' ? 'Completed' : 'Enrolled',
    students: cls.class_size === 'group' ? 15 : 1, // Default values
    image: cls.thumbnail_url || "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=300",
    rating: 4.8, // Default rating
    description: cls.description || "No description available.",
    classSize: cls.class_size === 'group' ? "Group" : "1-on-1",
  };
};
