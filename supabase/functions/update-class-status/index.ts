
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for admin operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting class status update process...');

    // Call the database function to update class statuses
    const { data, error } = await supabase.rpc('update_class_statuses');

    if (error) {
      console.error('Error updating class statuses:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message,
          timestamp: new Date().toISOString()
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get updated class counts for reporting
    const { data: statusCounts } = await supabase
      .from('classes')
      .select('status')
      .then(({ data }) => {
        if (!data) return { data: [] };
        
        const counts = data.reduce((acc: Record<string, number>, cls) => {
          acc[cls.status] = (acc[cls.status] || 0) + 1;
          return acc;
        }, {});
        
        return { data: counts };
      });

    console.log('Class status update completed successfully');
    console.log('Current status distribution:', statusCounts);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Class statuses updated successfully',
        statusDistribution: statusCounts,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
