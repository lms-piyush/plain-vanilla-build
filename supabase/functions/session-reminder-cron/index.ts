import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting session reminder cron job...');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get current time and 1 hour from now for upcoming session check
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    
    console.log(`Checking for sessions starting between ${now.toISOString()} and ${oneHourFromNow.toISOString()}`);

    // Find upcoming sessions within the next hour
    const { data: upcomingSessions, error: sessionError } = await supabase
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
          tutor_id,
          status,
          batch_number
        )
      `)
      .eq('status', 'upcoming')
      .gte('session_date', now.toISOString().split('T')[0])
      .lte('session_date', oneHourFromNow.toISOString().split('T')[0]);

    if (sessionError) {
      console.error('Error fetching upcoming sessions:', sessionError);
      throw sessionError;
    }

    console.log(`Found ${upcomingSessions?.length || 0} upcoming sessions`);

    if (!upcomingSessions || upcomingSessions.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No upcoming sessions found',
          sessionsProcessed: 0 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    let notificationsSent = 0;

    for (const session of upcomingSessions) {
      try {
        // Check if we've already sent a reminder for this session
        const { data: existingNotification, error: trackingError } = await supabase
          .from('notification_tracking')
          .select('id')
          .eq('session_id', session.id)
          .eq('notification_type', 'session_reminder')
          .single();

        if (trackingError && trackingError.code !== 'PGRST116') {
          console.error('Error checking notification tracking:', trackingError);
          continue;
        }

        if (existingNotification) {
          console.log(`Reminder already sent for session ${session.id}`);
          continue;
        }

        // Check if the session is actually within the next hour by time
        const sessionDateTime = new Date(`${session.session_date}T${session.start_time || '00:00:00'}`);
        const timeDifference = sessionDateTime.getTime() - now.getTime();
        const hoursUntilSession = timeDifference / (1000 * 60 * 60);

        // Only send reminders for sessions starting within the next hour
        if (hoursUntilSession <= 0 || hoursUntilSession > 1) {
          console.log(`Session ${session.id} is not within reminder window (${hoursUntilSession} hours)`);
          continue;
        }

        console.log(`Processing session: ${session.title} starting at ${sessionDateTime.toISOString()}`);

        // Send notification to tutor
        const { error: tutorNotificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: session.classes.tutor_id,
            title: 'Upcoming Session Reminder',
            description: `Your class "${session.classes.title}" session "${session.title}" starts in less than an hour.`,
            notification_type: 'session_reminder',
            reference_table: 'class_syllabus',
            reference_id: session.id
          });

        if (tutorNotificationError) {
          console.error('Error sending tutor notification:', tutorNotificationError);
        } else {
          console.log(`Tutor notification sent for session ${session.id}`);
          notificationsSent++;
        }

        // Get enrolled students for this class (latest batch)
        const { data: enrollments, error: enrollmentError } = await supabase
          .from('student_enrollments')
          .select('student_id')
          .eq('class_id', session.class_id)
          .eq('batch_number', session.classes.batch_number)
          .eq('status', 'active');

        if (enrollmentError) {
          console.error('Error fetching enrollments:', enrollmentError);
        } else if (enrollments && enrollments.length > 0) {
          // Send notifications to all enrolled students
          const studentNotifications = enrollments.map(enrollment => ({
            user_id: enrollment.student_id,
            title: 'Upcoming Session Reminder',
            description: `Your class "${session.classes.title}" session "${session.title}" starts in less than an hour.`,
            notification_type: 'student_session_reminder',
            reference_table: 'class_syllabus',
            reference_id: session.id
          }));

          const { error: studentNotificationError } = await supabase
            .from('notifications')
            .insert(studentNotifications);

          if (studentNotificationError) {
            console.error('Error sending student notifications:', studentNotificationError);
          } else {
            console.log(`Student notifications sent for ${enrollments.length} students for session ${session.id}`);
            notificationsSent += enrollments.length;
          }
        }

        // Mark this session as having sent a reminder
        const { error: trackingInsertError } = await supabase
          .from('notification_tracking')
          .insert({
            session_id: session.id,
            notification_type: 'session_reminder'
          });

        if (trackingInsertError) {
          console.error('Error inserting notification tracking:', trackingInsertError);
        } else {
          console.log(`Notification tracking recorded for session ${session.id}`);
        }

      } catch (sessionError) {
        console.error(`Error processing session ${session.id}:`, sessionError);
        continue;
      }
    }

    console.log(`Session reminder cron job completed. Notifications sent: ${notificationsSent}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Session reminders processed successfully`,
        sessionsProcessed: upcomingSessions.length,
        notificationsSent
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in session reminder cron job:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});