import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface ParentPreferences {
  id: string;
  parent_id: string;
  email_notifications: boolean;
  class_reminders: boolean;
  progress_reports: boolean;
  spending_limit_per_child: number | null;
  created_at: string;
  updated_at: string;
}

export const useParentPreferences = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ["parent-preferences", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("parent_preferences")
        .select("*")
        .eq("parent_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return data as ParentPreferences | null;
    },
    enabled: !!user?.id && user?.role === "parent",
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: Partial<ParentPreferences>) => {
      if (!user?.id) throw new Error("User not authenticated");

      // Check if preferences exist
      const { data: existing } = await supabase
        .from("parent_preferences")
        .select("id")
        .eq("parent_id", user.id)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from("parent_preferences")
          .update(updates)
          .eq("parent_id", user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new
        const { data, error } = await supabase
          .from("parent_preferences")
          .insert({
            parent_id: user.id,
            ...updates,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent-preferences"] });
      toast.success("Preferences updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update preferences");
    },
  });

  return {
    preferences,
    isLoading,
    updatePreferences: updatePreferencesMutation.mutate,
    isUpdating: updatePreferencesMutation.isPending,
  };
};