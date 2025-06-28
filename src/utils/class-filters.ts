
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
  console.log("Filters applied:", filters);
  
  // Apply filters if filter sheet has been opened
  if (filters.filterOpen) {
    console.log("Applying filters...");
    
    // Apply mode filter
    filtered = filtered.filter(course => {
      const modeMatch = course.delivery_mode === filters.classMode;
      if (!modeMatch) {
        console.log(`Course ${course.title} filtered out by mode: ${course.delivery_mode} !== ${filters.classMode}`);
      }
      return modeMatch;
    });
    
    // Apply format filter
    filtered = filtered.filter(course => {
      const formatMatch = course.class_format === filters.classFormat;
      if (!formatMatch) {
        console.log(`Course ${course.title} filtered out by format: ${course.class_format} !== ${filters.classFormat}`);
      }
      return formatMatch;
    });
    
    // Apply class size filter
    filtered = filtered.filter(course => {
      const sizeMatch = filters.classSize === "group" 
        ? course.class_size === "group" 
        : course.class_size === "one-on-one";
      if (!sizeMatch) {
        console.log(`Course ${course.title} filtered out by size: ${course.class_size} !== ${filters.classSize}`);
      }
      return sizeMatch;
    });
    
    // Apply duration filter
    filtered = filtered.filter(course => {
      const durationMatch = filters.classDuration === "finite" 
        ? course.duration_type === "fixed" 
        : course.duration_type === "recurring";
      if (!durationMatch) {
        console.log(`Course ${course.title} filtered out by duration: ${course.duration_type} !== ${filters.classDuration}`);
      }
      return durationMatch;
    });
    
    console.log("Classes after filtering:", filtered.length);
  } else {
    console.log("Filter not opened, showing all classes");
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
  const saved = allClasses.filter(course => wishlistedCourses.includes(course.id));
  console.log("Saved classes found:", saved.length);
  return saved;
};
