import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface CreateTicketData {
  subject: string;
  message: string;
  priority?: "low" | "normal" | "high" | "urgent";
}

export const useSupportTicket = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createTicket = useMutation({
    mutationFn: async (data: CreateTicketData) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("support_tickets")
        .insert({
          user_id: user.id,
          subject: data.subject,
          message: data.message,
          priority: data.priority || "normal",
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      toast({
        title: "Ticket created",
        description: "Your support ticket has been submitted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create support ticket",
        variant: "destructive",
      });
    },
  });

  return {
    createTicket: createTicket.mutate,
    isCreating: createTicket.isPending,
  };
};
