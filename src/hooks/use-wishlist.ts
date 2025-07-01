
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useWishlist = () => {
  const { toast } = useToast();
  const [wishlistedCourses, setWishlistedCourses] = useState<string[]>([]);

  const toggleWishlist = (courseId: string) => {
    setWishlistedCourses((prev) => {
      const isCurrentlyWishlisted = prev.includes(courseId);
      const newWishlist = isCurrentlyWishlisted 
        ? prev.filter(id => id !== courseId) 
        : [...prev, courseId];
      
      toast({
        title: isCurrentlyWishlisted ? "Removed from saved classes" : "Added to saved classes",
        description: isCurrentlyWishlisted 
          ? "The class has been removed from your saved list." 
          : "The class has been added to your saved list.",
      });
      
      return newWishlist;
    });
  };

  return {
    wishlist: wishlistedCourses, // Keep both for backwards compatibility
    wishlistedCourses,
    toggleWishlist
  };
};
