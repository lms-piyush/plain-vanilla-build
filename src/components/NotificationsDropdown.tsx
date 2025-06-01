
import React, { useRef, useEffect } from 'react';
import { CheckCheck, X } from 'lucide-react';

interface NotificationsDropdownProps {
  onClose: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const notifications = [
    {
      id: 1,
      title: "Your course 'Basic Python' has been approved",
      time: "10 minutes ago"
    },
    {
      id: 2,
      title: "New student enrolled in 'Digital Marketing 101'",
      time: "2 hours ago"
    },
    {
      id: 3,
      title: "Payment of ₹15,000 transferred to your account",
      time: "Yesterday"
    }
  ];

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <div className="flex items-center">
          <button 
            className="p-1 text-gray-500 hover:text-gray-700"
            title="Mark all as read"
          >
            <CheckCheck size={16} />
          </button>
          <button 
            className="p-1 text-gray-500 hover:text-gray-700 ml-2" 
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-start">
              <div className="h-2 w-2 bg-accent rounded-full mt-2 mr-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm text-gray-800">{notification.title}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="px-4 py-2 border-t border-gray-200">
        <button className="text-primary hover:text-primary-dark text-xs font-medium">
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
