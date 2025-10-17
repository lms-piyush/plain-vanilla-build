import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  user_id: string;
  type: string | null;
  is_read: boolean;
  metadata: any;
  created_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const NOTIFICATIONS_PER_PAGE = 5;

  // Fetch notifications with pagination
  const fetchNotifications = async (page = 1, append = false) => {
    if (!user) return;

    setLoading(true);
    try {
      const from = (page - 1) * NOTIFICATIONS_PER_PAGE;
      const to = from + NOTIFICATIONS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const newNotifications = (data as any[]) || [];
      
      if (append) {
        setNotifications(prev => [...prev, ...(newNotifications as any as Notification[])]);
      } else {
        setNotifications(newNotifications as any as Notification[]);
      }

      // Check if there are more notifications
      setHasMore(newNotifications.length === NOTIFICATIONS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    if (!user) return;

    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Create notification
  const createNotification = async (notificationData: {
    title: string;
    message: string;
    user_id: string;
    type?: string;
    metadata?: any;
  }) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([notificationData]);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  };

  // Load more notifications
  const loadMore = () => {
    if (!hasMore || loading) return;
    
    const nextPage = Math.ceil(notifications.length / NOTIFICATIONS_PER_PAGE) + 1;
    fetchNotifications(nextPage, true);
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    fetchNotifications();
    fetchUnreadCount();

    // Create a unique channel name based on user ID and timestamp to avoid conflicts
    const channelName = `notifications-${user.id}-${Date.now()}`;
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as any as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updatedNotification = payload.new as any as Notification;
          setNotifications(prev => 
            prev.map(notif => 
              notif.id === updatedNotification.id ? updatedNotification : notif
            )
          );
        }
      )
      .subscribe();

    return () => {
      // Properly unsubscribe from the channel
      channel.unsubscribe();
    };
  }, [user?.id]);

  return {
    notifications,
    loading,
    hasMore,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    loadMore,
  };
};