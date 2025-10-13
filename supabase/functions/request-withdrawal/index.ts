import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { amount, bank_account_id } = await req.json();

    // Validate inputs
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid withdrawal amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!bank_account_id) {
      return new Response(
        JSON.stringify({ error: 'Bank account is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check minimum withdrawal threshold
    const MIN_WITHDRAWAL = 50;
    if (amount < MIN_WITHDRAWAL) {
      return new Response(
        JSON.stringify({ error: `Minimum withdrawal amount is $${MIN_WITHDRAWAL}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify bank account exists and is verified
    const { data: bankAccount, error: bankError } = await supabase
      .from('tutor_bank_accounts')
      .select('*')
      .eq('id', bank_account_id)
      .eq('tutor_id', user.id)
      .single();

    if (bankError || !bankAccount) {
      return new Response(
        JSON.stringify({ error: 'Bank account not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!bankAccount.is_verified) {
      return new Response(
        JSON.stringify({ error: 'Bank account must be verified before withdrawal' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate available balance
    const { data: earnings, error: earningsError } = await supabase
      .from('tutor_earnings')
      .select('net_amount, status')
      .eq('tutor_id', user.id)
      .eq('status', 'available');

    if (earningsError) {
      console.error('Error fetching earnings:', earningsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch available balance' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const availableBalance = earnings?.reduce((sum, e) => sum + Number(e.net_amount), 0) || 0;

    if (amount > availableBalance) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient available balance',
          available: availableBalance 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create withdrawal request
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawal_requests')
      .insert({
        tutor_id: user.id,
        bank_account_id,
        amount,
        currency: 'USD',
        status: 'pending'
      })
      .select()
      .single();

    if (withdrawalError) {
      console.error('Error creating withdrawal request:', withdrawalError);
      return new Response(
        JSON.stringify({ error: 'Failed to create withdrawal request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create notification for tutor
    await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'withdrawal',
      title: 'Withdrawal Request Submitted',
      message: `Your withdrawal request for $${amount} has been submitted and is pending review.`,
      metadata: { withdrawal_id: withdrawal.id }
    });

    console.log('Withdrawal request created:', withdrawal.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        withdrawal,
        message: 'Withdrawal request submitted successfully. Processing typically takes 3-5 business days.' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in request-withdrawal function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});