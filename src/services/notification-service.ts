import { supabase } from '@/integrations/supabase/client';

export interface NotificationData {
  title: string;
  description: string;
  user_id: string;
  sender_id?: string;
  notification_type: string;
  reference_id?: string;
  reference_table?: string;
}

export const notificationService = {
  // Create a notification
  async createNotification(data: NotificationData) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([data]);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Notification for class creation
  async notifyClassCreated(classId: string, tutorId: string, classTitle: string, status: string) {
    await this.createNotification({
      title: 'Class Created Successfully',
      description: `Your class "${classTitle}" has been created and is now ${status}.`,
      user_id: tutorId,
      notification_type: 'class_created',
      reference_id: classId,
      reference_table: 'classes',
    });
  },

  // Notification for student enrollment
  async notifyStudentEnrollment(classId: string, tutorId: string, studentName: string, className: string, enrollmentDate?: string) {
    const timestamp = enrollmentDate ? new Date(enrollmentDate).toLocaleDateString() : 'today';
    
    await this.createNotification({
      title: 'New Student Enrollment',
      description: `${studentName} has enrolled in your class "${className}" on ${timestamp}.`,
      user_id: tutorId,
      notification_type: 'student_enrollment',
      reference_id: classId,
      reference_table: 'classes',
    });
  },

  // Notification for new message
  async notifyNewMessage(senderId: string, recipientId: string, senderName: string, senderType: 'student' | 'tutor') {
    await this.createNotification({
      title: 'New Message',
      description: `You have a new message from ${senderType === 'student' ? 'Student' : 'Tutor'} ${senderName}.`,
      user_id: recipientId,
      sender_id: senderId,
      notification_type: 'message_received',
      reference_table: 'messages',
    });
  },

  // Notification for class review
  async notifyClassReview(classId: string, tutorId: string, studentName: string, className: string, rating: number, reviewText?: string, isUpdate = false) {
    const reviewPreview = reviewText ? ` "${reviewText.substring(0, 50)}${reviewText.length > 50 ? '...' : ''}"` : '';
    
    await this.createNotification({
      title: isUpdate ? 'Review Updated' : 'New Review Received',
      description: `${studentName} ${isUpdate ? 'updated their' : 'left a'} ${rating}-star review for your class "${className}".${reviewPreview}`,
      user_id: tutorId,
      notification_type: isUpdate ? 'class_review_updated' : 'class_review',
      reference_id: classId,
      reference_table: 'class_reviews',
    });
  },

  // Notification for tutor review
  async notifyTutorReview(tutorId: string, studentName: string, rating: number, reviewText?: string, isUpdate = false) {
    const reviewPreview = reviewText ? ` "${reviewText.substring(0, 50)}${reviewText.length > 50 ? '...' : ''}"` : '';
    
    await this.createNotification({
      title: isUpdate ? 'Review Updated' : 'New Review Received',
      description: `${studentName} ${isUpdate ? 'updated their' : 'left a'} ${rating}-star review for your teaching.${reviewPreview}`,
      user_id: tutorId,
      notification_type: isUpdate ? 'tutor_review_updated' : 'tutor_review',
      reference_table: 'tutor_reviews',
    });
  },

  // Notification for upcoming session reminder
  async notifySessionReminder(classId: string, tutorId: string, sessionTitle: string, sessionDate: string, sessionTime: string) {
    await this.createNotification({
      title: 'Session Reminder',
      description: `You have an upcoming session "${sessionTitle}" scheduled for ${sessionDate} at ${sessionTime}.`,
      user_id: tutorId,
      notification_type: 'session_reminder',
      reference_id: classId,
      reference_table: 'class_syllabus',
    });
  },

  // Notification for student when they successfully enroll in a class
  async notifyStudentEnrollmentSuccess(classId: string, studentId: string, className: string, tutorName: string) {
    await this.createNotification({
      title: 'Enrollment Successful',
      description: `You have successfully enrolled in "${className}" with tutor ${tutorName}. Your learning journey begins now!`,
      user_id: studentId,
      notification_type: 'enrollment_success',
      reference_id: classId,
      reference_table: 'classes',
    });
  },

  // Notification for student session reminder
  async notifyStudentSessionReminder(classId: string, studentId: string, sessionTitle: string, sessionDate: string, sessionTime: string) {
    await this.createNotification({
      title: 'Upcoming Session',
      description: `You have an upcoming session "${sessionTitle}" scheduled for ${sessionDate} at ${sessionTime}.`,
      user_id: studentId,
      notification_type: 'student_session_reminder',
      reference_id: classId,
      reference_table: 'class_syllabus',
    });
  },

  // Get notifications for a user with pagination
  async getNotifications(userId: string, page = 1, limit = 5) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          sender:profiles!notifications_sender_id_fkey(full_name, avatar_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Get unread notification count
  async getUnreadCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },
};