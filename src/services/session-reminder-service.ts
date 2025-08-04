import { supabase } from '@/integrations/supabase/client';
import { notificationService } from './notification-service';

export const sessionReminderService = {
  // Check for upcoming sessions and send reminders
  async checkAndSendSessionReminders() {
    try {
      // Get sessions that are happening within the next 24 hours and haven't been notified yet
      const tomorrow = new Date();
      tomorrow.setHours(tomorrow.getHours() + 24);
      
      const today = new Date();
      
      const { data: upcomingSessions, error } = await supabase
        .from('class_syllabus')
        .select(`
          *,
          classes!inner(
            id,
            title,
            tutor_id,
            status
          )
        `)
        .eq('classes.status', 'running')
        .gte('session_date', today.toISOString().split('T')[0])
        .lte('session_date', tomorrow.toISOString().split('T')[0])
        .eq('status', 'upcoming');

      if (error) {
        console.error('Error fetching upcoming sessions:', error);
        return;
      }

      if (!upcomingSessions?.length) {
        console.log('No upcoming sessions found');
        return;
      }

      // Send notifications for each upcoming session
      for (const session of upcomingSessions) {
        const sessionDate = new Date(session.session_date).toLocaleDateString();
        const sessionTime = session.start_time || 'TBD';
        
        // Notify tutor
        await notificationService.notifySessionReminder(
          session.classes.id,
          session.classes.tutor_id,
          session.title,
          sessionDate,
          sessionTime
        );

        // Get enrolled students for this class
        const { data: enrollments } = await supabase
          .from('student_enrollments')
          .select('student_id')
          .eq('class_id', session.classes.id)
          .eq('status', 'active');

        // Notify each enrolled student
        if (enrollments?.length) {
          for (const enrollment of enrollments) {
            await notificationService.notifyStudentSessionReminder(
              session.classes.id,
              enrollment.student_id,
              session.title,
              sessionDate,
              sessionTime
            );
          }
        }

        console.log(`Session reminders sent for: ${session.title}`);
      }
    } catch (error) {
      console.error('Error in session reminder service:', error);
    }
  },

  // Schedule reminders for a specific class session
  async scheduleSessionReminder(sessionId: string) {
    try {
      const { data: session, error } = await supabase
        .from('class_syllabus')
        .select(`
          *,
          classes!inner(
            id,
            title,
            tutor_id
          )
        `)
        .eq('id', sessionId)
        .single();

      if (error || !session) {
        console.error('Error fetching session for reminder:', error);
        return;
      }

      // Check if session is within the next 24 hours
      const sessionDateTime = new Date(`${session.session_date}T${session.start_time || '00:00:00'}`);
      const now = new Date();
      const hoursUntilSession = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilSession > 0 && hoursUntilSession <= 24) {
        const sessionDate = sessionDateTime.toLocaleDateString();
        const sessionTime = session.start_time || 'TBD';
        
        // Notify tutor
        await notificationService.notifySessionReminder(
          session.classes.id,
          session.classes.tutor_id,
          session.title,
          sessionDate,
          sessionTime
        );

        // Get enrolled students
        const { data: enrollments } = await supabase
          .from('student_enrollments')
          .select('student_id')
          .eq('class_id', session.classes.id)
          .eq('status', 'active');

        // Notify students
        if (enrollments?.length) {
          for (const enrollment of enrollments) {
            await notificationService.notifyStudentSessionReminder(
              session.classes.id,
              enrollment.student_id,
              session.title,
              sessionDate,
              sessionTime
            );
          }
        }

        console.log(`Session reminders scheduled for: ${session.title}`);
      }
    } catch (error) {
      console.error('Error scheduling session reminder:', error);
    }
  }
};