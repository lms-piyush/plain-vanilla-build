import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useWishlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("wishlist")
        .select(`
          *,
          classes (
            *,
            profiles!classes_tutor_id_fkey (
              full_name
            ),
            class_reviews (
              rating
            ),
            class_time_slots (
              day_of_week,
              start_time
            )
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const addToWishlist = useMutation({
    mutationFn: async (classId: string) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("wishlist")
        .insert({ user_id: user.id, class_id: classId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", user?.id] });
      toast({
        title: "Added to saved classes",
        description: "Class has been saved to your wishlist",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add to wishlist",
        variant: "destructive",
      });
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: async (classId: string) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("class_id", classId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", user?.id] });
      toast({
        title: "Removed from saved classes",
        description: "Class has been removed from your wishlist",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove from wishlist",
        variant: "destructive",
      });
    },
  });

  const toggleWishlist = (classId: string) => {
    if (isInWishlist(classId)) {
      removeFromWishlist.mutate(classId);
    } else {
      addToWishlist.mutate(classId);
    }
  };

  const isInWishlist = (classId: string) => {
    return wishlist.some((item: any) => item.class_id === classId);
  };

  const wishlistedCourses = wishlist.map((item: any) => item.class_id);

  return {
    wishlist,
    wishlistedCourses,
    isLoading,
    addToWishlist: addToWishlist.mutate,
    removeFromWishlist: removeFromWishlist.mutate,
    toggleWishlist,
    isInWishlist,
  };
};
