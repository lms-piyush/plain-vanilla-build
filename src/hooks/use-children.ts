import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Child {
  id: string;
  parent_id: string;
  name: string;
  age: number | null;
  grade_level: string | null;
  date_of_birth: string | null;
  interests: string[] | null;
  created_at: string;
  updated_at: string;
}

export const useChildren = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: children, isLoading } = useQuery({
    queryKey: ["children", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("parent_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Child[];
    },
    enabled: !!user,
  });

  const addChildMutation = useMutation({
    mutationFn: async (childData: Omit<Child, "id" | "parent_id" | "created_at" | "updated_at">) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("children")
        .insert({
          parent_id: user.id,
          ...childData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      toast.success("Child added successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add child");
    },
  });

  const updateChildMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Child> & { id: string }) => {
      const { data, error } = await supabase
        .from("children")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      toast.success("Child updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update child");
    },
  });

  const deleteChildMutation = useMutation({
    mutationFn: async (childId: string) => {
      const { error } = await supabase
        .from("children")
        .delete()
        .eq("id", childId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      toast.success("Child removed successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove child");
    },
  });

  return {
    children: children || [],
    isLoading,
    addChild: addChildMutation.mutate,
    updateChild: updateChildMutation.mutate,
    deleteChild: deleteChildMutation.mutate,
  };
};
