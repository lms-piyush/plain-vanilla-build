
import { TutorClass } from "@/hooks/use-all-classes";

interface FilterOptions {
  classMode: "online" | "offline";
  classFormat: "live" | "recorded" | "inbound" | "outbound";
  classSize: "group" | "1-on-1";
  classDuration: "finite" | "infinite";
  sortBy: string;
  filterOpen: boolean;
}

export const getFilteredClasses = (
  allClasses: TutorClass[], 
  filters: FilterOptions
) => {
  if (!allClasses || !Array.isArray(allClasses)) {
    console.log("allClasses is not an array:", allClasses);
    return [];
  }
  
  let filtered = [...allClasses];
  
  console.log("Filtering classes:", filtered.length, "total classes");
  
  // Apply filters if they've been set
  if (filters.filterOpen) {
    // Apply mode filter
    filtered = filtered.filter(course => {
      if (filters.classMode === "online") {
        return course.delivery_mode === "online";
      } else {
        return course.delivery_mode === "offline";
      }
    });
    
    // Apply format filter
    filtered = filtered.filter(course => {
      return course.class_format === filters.classFormat;
    });
    
    // Apply class size filter
    filtered = filtered.filter(course => {
      if (filters.classSize === "group") {
        return course.class_size === "group";
      } else {
        return course.class_size === "one-on-one";
      }
    });
    
    // Apply duration filter
    filtered = filtered.filter(course => {
      if (filters.classDuration === "finite") {
        return course.duration_type === "fixed";
      } else {
        return course.duration_type === "recurring";
      }
    });
  }
  
  // Sort the classes
  switch (filters.sortBy) {
    case "rating":
      return [...filtered].sort((a, b) => 4.5 - 4.5); // Would use real ratings
    case "newest":
      return [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case "popular":
    default:
      return filtered;
  }
};

export const getSavedClasses = (allClasses: TutorClass[], wishlistedCourses: string[]) => {
  if (!allClasses || !Array.isArray(allClasses)) {
    return [];
  }
  return allClasses.filter(course => wishlistedCourses.includes(course.id));
};
