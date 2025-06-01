
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, HelpCircle, ChevronDown, X } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileDropdown from './ProfileDropdown';

interface NavbarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, sidebarOpen }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen) setProfileOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    if (!profileOpen) setNotificationsOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
          >
            <Menu size={20} />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/help" className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none">
            <HelpCircle size={20} />
          </Link>
          
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none relative"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-4 w-4 bg-accent rounded-full text-xs flex items-center justify-center text-white">
                3
              </span>
            </button>
            
            {notificationsOpen && (
              <NotificationsDropdown onClose={() => setNotificationsOpen(false)} />
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={toggleProfile}
              className="flex items-center space-x-2 text-sm font-medium focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                T
              </div>
              <span className="hidden md:block">Tutor</span>
              <ChevronDown size={16} className="hidden md:block" />
            </button>
            
            {profileOpen && (
              <ProfileDropdown onClose={() => setProfileOpen(false)} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
