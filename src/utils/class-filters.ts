import { TutorClass } from "@/hooks/use-all-classes";

export interface FilterOptions {
  classMode: "online" | "offline";
  classFormat: "live" | "recorded" | "inbound" | "outbound";
  classSize: "group" | "1-on-1";
  classDuration: "finite" | "infinite";
  sortBy: string;
  filterOpen: boolean;
}

export const getFilteredClasses = (
  allClasses: TutorClass[],
  options: FilterOptions
): TutorClass[] => {
  let filtered = [...allClasses];

  // Filter by enrollment deadline - only show classes with future enrollment deadlines
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for comparison
  
  filtered = filtered.filter(cls => {
    if (!cls.enrollment_deadline) return true; // Show classes without deadline
    
    const enrollmentDate = new Date(cls.enrollment_deadline);
    enrollmentDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
    return enrollmentDate >= today; // Only show classes with future or today's deadline
  });

  // Apply existing filters
  filtered = filtered.filter(cls => {
    // Filter by delivery mode
    if (cls.delivery_mode !== options.classMode) return false;
    
    // Filter by class format
    if (cls.class_format !== options.classFormat) return false;
    
    // Filter by class size
    const classSize = cls.class_size === 'one-on-one' ? '1-on-1' : 'group';
    if (classSize !== options.classSize) return false;
    
    // Filter by duration type
    const durationType = cls.duration_type === 'recurring' ? 'infinite' : 'finite';
    if (durationType !== options.classDuration) return false;
    
    return true;
  });

  // Sort the filtered results
  switch (options.sortBy) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case 'oldest':
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      break;
    case 'price-low':
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case 'price-high':
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case 'popular':
    default:
      // Keep original order for popular (could be enhanced with actual popularity metrics)
      break;
  }

  return filtered;
};

export const getSavedClasses = (
  allClasses: TutorClass[],
  wishlistedCourses: string[]
): TutorClass[] => {
  const savedClasses = allClasses.filter(cls => wishlistedCourses.includes(cls.id));
  
  // Also filter saved classes by enrollment deadline
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return savedClasses.filter(cls => {
    if (!cls.enrollment_deadline) return true;
    
    const enrollmentDate = new Date(cls.enrollment_deadline);
    enrollmentDate.setHours(0, 0, 0, 0);
    
    return enrollmentDate >= today;
  });
};
