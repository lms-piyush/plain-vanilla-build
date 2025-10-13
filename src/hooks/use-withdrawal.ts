import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface BankAccount {
  id: string;
  tutor_id: string;
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  routing_number: string;
  account_type: 'checking' | 'savings';
  is_primary: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface WithdrawalRequest {
  id: string;
  tutor_id: string;
  bank_account_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected' | 'cancelled';
  requested_at: string;
  processed_at?: string;
  rejection_reason?: string;
  transaction_reference?: string;
}

export interface TutorEarning {
  id: string;
  tutor_id: string;
  class_id?: string;
  enrollment_id?: string;
  amount: number;
  currency: string;
  platform_fee: number;
  net_amount: number;
  status: 'pending' | 'available' | 'withdrawn' | 'refunded';
  earned_at: string;
  available_at?: string;
  withdrawn_at?: string;
}

// Fetch available balance
export const useAvailableBalance = () => {
  return useQuery({
    queryKey: ['available-balance'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tutor_earnings')
        .select('net_amount')
        .eq('tutor_id', user.user.id)
        .eq('status', 'available');

      if (error) throw error;

      const total = data?.reduce((sum, e) => sum + Number(e.net_amount), 0) || 0;
      return total;
    },
  });
};

// Fetch bank accounts
export const useBankAccounts = () => {
  return useQuery({
    queryKey: ['bank-accounts'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tutor_bank_accounts')
        .select('*')
        .eq('tutor_id', user.user.id)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BankAccount[];
    },
  });
};

// Add bank account
export const useAddBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountData: Omit<BankAccount, 'id' | 'tutor_id' | 'created_at' | 'updated_at' | 'is_verified'>) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tutor_bank_accounts')
        .insert({
          ...accountData,
          tutor_id: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] });
      toast({
        title: "Success",
        description: "Bank account added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Delete bank account
export const useDeleteBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountId: string) => {
      const { error } = await supabase
        .from('tutor_bank_accounts')
        .delete()
        .eq('id', accountId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] });
      toast({
        title: "Success",
        description: "Bank account deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Fetch withdrawal requests
export const useWithdrawalRequests = () => {
  return useQuery({
    queryKey: ['withdrawal-requests'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('tutor_id', user.user.id)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      return data as WithdrawalRequest[];
    },
  });
};

// Request withdrawal
export const useRequestWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, bank_account_id }: { amount: number; bank_account_id: string }) => {
      const { data, error } = await supabase.functions.invoke('request-withdrawal', {
        body: { amount, bank_account_id }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawal-requests'] });
      queryClient.invalidateQueries({ queryKey: ['available-balance'] });
      toast({
        title: "Success",
        description: "Withdrawal request submitted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Cancel withdrawal request
export const useCancelWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (withdrawalId: string) => {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({ status: 'cancelled' })
        .eq('id', withdrawalId)
        .eq('status', 'pending');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawal-requests'] });
      toast({
        title: "Success",
        description: "Withdrawal request cancelled",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};