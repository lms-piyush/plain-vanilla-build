import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  stripe_price_id: string;
  amount: number;
  currency: string;
  interval_type: string;
  features: string[];
  is_active: boolean;
}

export interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_status: string | null;
  subscription_end: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
}

export interface SubscriptionHistory {
  id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: string;
  billing_period_start: string;
  billing_period_end: string;
  paid_at: string | null;
  created_at: string;
}

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async (): Promise<SubscriptionPlan[]> => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("amount", { ascending: true });

      if (error) {
        console.error("Error fetching subscription plans:", error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useSubscriptionStatus = () => {
  return useQuery({
    queryKey: ["subscription-status"],
    queryFn: async (): Promise<SubscriptionStatus | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("subscribers")
        .select(`
          subscribed,
          subscription_tier,
          subscription_status,
          subscription_end,
          current_period_start,
          current_period_end
        `)
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching subscription status:", error);
        throw error;
      }

      return data || {
        subscribed: false,
        subscription_tier: null,
        subscription_status: null,
        subscription_end: null,
        current_period_start: null,
        current_period_end: null,
      };
    },
  });
};

export const useSubscriptionHistory = () => {
  return useQuery({
    queryKey: ["subscription-history"],
    queryFn: async (): Promise<SubscriptionHistory[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("subscription_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching subscription history:", error);
        throw error;
      }

      return data || [];
    },
  });
};

export const useCreateSubscriptionCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ priceId, classId, classCount = 1 }: { priceId: string; classId?: string; classCount?: number }) => {
      const { data, error } = await supabase.functions.invoke("create-subscription-checkout", {
        body: { priceId, classId, classCount },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    },
    onError: (error: any) => {
      console.error("Error creating subscription checkout:", error);
      toast({
        title: "Error",
        description: "Failed to create subscription checkout. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useProcessSubscriptionSuccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, classId }: { sessionId: string; classId?: string }) => {
      const { data, error } = await supabase.functions.invoke("process-subscription-success", {
        body: { sessionId, classId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch subscription-related queries
      queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-history"] });
      queryClient.invalidateQueries({ queryKey: ["student-enrollments"] });
      
      toast({
        title: "Subscription activated!",
        description: "Your subscription has been successfully activated.",
      });
    },
    onError: (error: any) => {
      console.error("Error processing subscription:", error);
      toast({
        title: "Error",
        description: "Failed to process subscription. Please contact support.",
        variant: "destructive",
      });
    },
  });
};

export const useCreatePaymentCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, description, classId, currency = "usd" }: { 
      amount: number; 
      description: string; 
      classId?: string; 
      currency?: string; 
    }) => {
      const { data, error } = await supabase.functions.invoke("create-payment-checkout", {
        body: { amount, description, classId, currency },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    },
    onError: (error: any) => {
      console.error("Error creating payment checkout:", error);
      toast({
        title: "Error",
        description: "Failed to create payment checkout. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useProcessEnhancedEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId }: { sessionId: string }) => {
      const { data, error } = await supabase.functions.invoke("process-enhanced-enrollment", {
        body: { sessionId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
      queryClient.invalidateQueries({ queryKey: ["student-enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["student-class-details"] });
      
      toast({
        title: "Enrollment successful!",
        description: "You have been successfully enrolled in the class.",
      });
    },
    onError: (error: any) => {
      console.error("Error processing enrollment:", error);
      toast({
        title: "Error",
        description: "Failed to process enrollment. Please contact support.",
        variant: "destructive",
      });
    },
  });
};

export const useCheckSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-status"] });
    },
    onError: (error: any) => {
      console.error("Error checking subscription:", error);
    },
  });
};