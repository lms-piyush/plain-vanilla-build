import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationPayload {
  parentId: string;
  childId: string;
  type: 'class_reminder' | 'session_completed' | 'new_recommendation';
  metadata: {
    classId?: string;
    className?: string;
    sessionDate?: string;
    sessionTime?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { parentId, childId, type, metadata }: NotificationPayload = await req.json();

    console.log('Creating parent notification:', { parentId, childId, type });

    // Generate notification content based on type
    let title = '';
    let message = '';

    switch (type) {
      case 'class_reminder':
        title = 'Class Starting Soon';
        message = `${metadata.className} for your child starts at ${metadata.sessionTime} on ${metadata.sessionDate}`;
        break;
      case 'session_completed':
        title = 'Session Completed';
        message = `Your child has completed a session of ${metadata.className}`;
        break;
      case 'new_recommendation':
        title = 'New Class Recommendation';
        message = `We found a new class that might interest your child: ${metadata.className}`;
        break;
      default:
        title = 'Notification';
        message = 'You have a new update';
    }

    // Insert notification into parent_notifications table
    const { data, error } = await supabase
      .from('parent_notifications')
      .insert({
        parent_id: parentId,
        child_id: childId,
        type,
        title,
        message,
        metadata,
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }

    console.log('Notification created successfully:', data);

    return new Response(
      JSON.stringify({ success: true, notification: data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in notify-parents function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
})
