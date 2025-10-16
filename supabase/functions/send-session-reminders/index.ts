import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    console.log('Session reminder cron job started');

    // Get current time + 24 hours
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Format dates for comparison
    const tomorrowDateString = tomorrow.toISOString().split('T')[0];
    console.log('Checking for sessions on:', tomorrowDateString);

    // Fetch all sessions scheduled for tomorrow
    const { data: sessions, error: sessionsError } = await supabase
      .from('class_syllabus')
      .select(`
        id,
        title,
        session_date,
        start_time,
        class_id,
        classes!inner(
          id,
          title,
          tutor_id
        )
      `)
      .eq('session_date', tomorrowDateString)
      .eq('status', 'scheduled');

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      throw sessionsError;
    }

    console.log(`Found ${sessions?.length || 0} sessions for tomorrow`);

    if (!sessions || sessions.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No sessions found for tomorrow' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const reminders: any[] = [];

    // Process each session
    for (const session of sessions) {
      // Check tutor preferences
      const { data: tutorPrefs } = await supabase
        .from('tutor_preferences')
        .select('send_session_reminders, reminder_hours_before')
        .eq('tutor_id', session.classes.tutor_id)
        .maybeSingle();

      // Skip if tutor has disabled reminders
      if (tutorPrefs && !tutorPrefs.send_session_reminders) {
        console.log(`Tutor ${session.classes.tutor_id} has disabled reminders`);
        continue;
      }

      // Get enrolled students for this class
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('student_enrollments')
        .select(`
          id,
          student_id,
          child_id,
          enrolled_by_parent_id
        `)
        .eq('class_id', session.class_id)
        .in('status', ['active', 'pending']);

      if (enrollmentsError) {
        console.error('Error fetching enrollments:', enrollmentsError);
        continue;
      }

      console.log(`Found ${enrollments?.length || 0} enrollments for class ${session.class_id}`);

      // Create notifications for each enrollment
      for (const enrollment of enrollments || []) {
        // If parent enrolled, notify parent
        if (enrollment.enrolled_by_parent_id) {
          reminders.push({
            parent_id: enrollment.enrolled_by_parent_id,
            child_id: enrollment.child_id,
            type: 'class_reminder',
            title: 'Class Starting Tomorrow',
            message: `${session.classes.title} is scheduled for tomorrow at ${session.start_time}`,
            metadata: {
              classId: session.class_id,
              className: session.classes.title,
              sessionDate: session.session_date,
              sessionTime: session.start_time,
              sessionId: session.id,
            },
            is_read: false,
          });
        } else {
          // Notify student directly
          reminders.push({
            user_id: enrollment.student_id,
            type: 'class_reminder',
            title: 'Class Starting Tomorrow',
            message: `${session.classes.title} is scheduled for tomorrow at ${session.start_time}`,
            metadata: {
              classId: session.class_id,
              className: session.classes.title,
              sessionDate: session.session_date,
              sessionTime: session.start_time,
              sessionId: session.id,
            },
            is_read: false,
          });
        }
      }
    }

    console.log(`Creating ${reminders.length} reminders`);

    // Insert all reminders
    const parentNotifications = reminders.filter(r => r.parent_id);
    const studentNotifications = reminders.filter(r => r.user_id);

    if (parentNotifications.length > 0) {
      const { error: parentError } = await supabase
        .from('parent_notifications')
        .insert(parentNotifications);

      if (parentError) {
        console.error('Error creating parent notifications:', parentError);
      } else {
        console.log(`Created ${parentNotifications.length} parent notifications`);
      }
    }

    if (studentNotifications.length > 0) {
      const { error: studentError } = await supabase
        .from('notifications')
        .insert(studentNotifications);

      if (studentError) {
        console.error('Error creating student notifications:', studentError);
      } else {
        console.log(`Created ${studentNotifications.length} student notifications`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sessionsFound: sessions.length,
        remindersCreated: reminders.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in session-reminder-cron:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
})
