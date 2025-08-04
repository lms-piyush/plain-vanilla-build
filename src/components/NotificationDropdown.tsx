import { useState } from 'react';
import { Bell, CheckCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/use-notifications';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
  const { notifications, loading, hasMore, unreadCount, markAsRead, markAllAsRead, loadMore } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type and user role
    const currentPath = window.location.pathname;
    const isStudentRoute = currentPath.startsWith('/student');
    const isTutorRoute = currentPath.startsWith('/tutor');

    switch (notification.notification_type) {
      case 'class_created':
        navigate(`/tutor/classes/${notification.reference_id}`);
        break;
      case 'student_enrollment':
        navigate(`/tutor/classes/${notification.reference_id}`);
        break;
      case 'enrollment_success':
        if (isStudentRoute) {
          navigate(`/student/classes/${notification.reference_id}`);
        } else {
          navigate(`/student/classes/${notification.reference_id}`);
        }
        break;
      case 'message_received':
        if (isStudentRoute) {
          navigate('/student/messages');
        } else if (isTutorRoute) {
          navigate('/tutor/messages');
        } else {
          navigate('/tutor/messages');
        }
        break;
      case 'class_review':
      case 'class_review_updated':
        navigate(`/tutor/classes/${notification.reference_id}`);
        break;
      case 'tutor_review':
      case 'tutor_review_updated':
        navigate('/tutor/feedback');
        break;
      case 'session_reminder':
        navigate(`/tutor/classes/${notification.reference_id}`);
        break;
      case 'student_session_reminder':
        if (isStudentRoute) {
          navigate(`/student/classes/${notification.reference_id}`);
        } else {
          navigate(`/student/classes/${notification.reference_id}`);
        }
        break;
      default:
        break;
    }
    
    onClose();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'class_created':
        return '🎓';
      case 'student_enrollment':
        return '👨‍🎓';
      case 'enrollment_success':
        return '✅';
      case 'message_received':
        return '💬';
      case 'class_review':
      case 'class_review_updated':
        return '⭐';
      case 'tutor_review':
      case 'tutor_review_updated':
        return '🌟';
      case 'session_reminder':
      case 'student_session_reminder':
        return '⏰';
      default:
        return '📢';
    }
  };

  return (
    <Card className="absolute right-0 top-full mt-2 w-80 z-50 shadow-lg border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-8 w-8 p-0"
              title="Mark all as read"
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-80 overflow-y-auto">
          {loading && notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <>
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div 
                    className={`p-3 hover:bg-accent cursor-pointer transition-colors ${
                      !notification.is_read ? 'bg-accent/50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-lg flex-shrink-0">
                        {getNotificationIcon(notification.notification_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm text-foreground truncate">
                            {notification.title}
                          </p>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
              
              {hasMore && (
                <div className="p-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadMore}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Loading...' : 'Show More'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationDropdown;