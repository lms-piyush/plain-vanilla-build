
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, DollarSign, MessageSquare, ThumbsUp, LogOut } from 'lucide-react';

interface SidebarProps {
  open: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/tutor/', count: null },
    { name: 'Classes', icon: BookOpen, path: '/tutor/classes', count: 3 },
    { name: 'Earnings', icon: DollarSign, path: '/tutor/earnings', count: null },
    { name: 'Messages', icon: MessageSquare, path: '/tutor/messages', count: 2 },
    { name: 'Feedback', icon: ThumbsUp, path: '/tutor/feedback', count: null },
  ];

  return (
    <aside className={`${open ? 'w-64' : 'w-0 md:w-16'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col h-full`}>
      <div className="p-4 flex items-center justify-center">
        {open ? (
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">TS</span>
            </div>
            <span className="text-lg font-semibold">TalentSchool</span>
          </Link>
        ) : (
          <Link to="/" className="flex items-center justify-center">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">TS</span>
            </div>
          </Link>
        )}
      </div>
      
      <nav className="flex-1 pt-6">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors relative
                    ${isActive 
                      ? 'bg-primary text-white font-medium' 
                      : 'text-gray-700 hover:bg-primary-hover hover:text-primary'}`}
                >
                  <item.icon className={`${open ? 'mr-3' : 'mx-auto'} h-5 w-5`} />
                  {open && <span>{item.name}</span>}
                  
                  {item.count !== null && open && (
                    <span className="ml-auto bg-accent text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                  
                  {item.count !== null && !open && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-accent rounded-full text-xs flex items-center justify-center text-white">
                      {item.count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4">
        <button className={`flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 w-full
          ${open ? '' : 'justify-center'}`}
        >
          <LogOut className={`${open ? 'mr-3' : ''} h-5 w-5`} />
          {open && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
