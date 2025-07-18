
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Bell, Search, User, GraduationCap, Home, Menu, HelpCircle, Phone, MapPin, CreditCard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useTutorProfile } from "@/hooks/use-tutor-profile";
import { useNotifications } from "@/hooks/use-notifications";
import NotificationDropdown from "@/components/NotificationDropdown";

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const isTutorRoute = location.pathname.startsWith('/tutor');
  const { profile } = useTutorProfile(isTutorRoute ? user?.id : undefined);
  const { unreadCount } = useNotifications();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Dummy search results for "advanced" keyword
  const searchResults = [
    { id: "adv1", title: "Advanced Mathematics", tutor: "Prof. Johnson" },
    { id: "adv2", title: "Advanced Python Programming", tutor: "Dr. Smith" },
    { id: "adv3", title: "Advanced Data Structures", tutor: "Sarah Lee" },
    { id: "adv4", title: "Advanced UI/UX Design", tutor: "Michael Chen" },
    { id: "adv5", title: "Advanced Machine Learning", tutor: "Emma Watson" }
  ];

  const shouldShowResults = searchQuery.toLowerCase().includes("advanced");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
      setIsSearching(false);
    }
  };

  if (isTutorRoute) {
    // Tutor design - White theme with profile dropdown
    return (
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 h-16 flex items-center px-6">
        {/* Left Section - Sidebar Toggle only */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-md transition-colors" />
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center justify-end space-x-3 ml-auto">
          {/* Home Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            asChild
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Link to="/">
              <Home className="h-5 w-5" />
            </Link>
          </Button>

          {/* Help Button */}
          {/* <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <HelpCircle className="h-5 w-5" />
          </Button> */}

          {/* Notification Button */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setNotificationOpen(!notificationOpen)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
            {notificationOpen && (
              <NotificationDropdown onClose={() => setNotificationOpen(false)} />
            )}
          </div>
          
          {/* Profile Button with detailed dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || user?.avatar} alt={profile?.full_name || user?.fullName} />
                  <AvatarFallback className="bg-slate-900 text-white text-sm font-medium">
                    {(profile?.full_name || user?.fullName)?.charAt(0).toUpperCase() || 'T'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">{profile?.full_name || user?.fullName || 'Tutor'}</div>
                  <div className="text-xs text-gray-500">{profile?.position || 'Tutor'}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-white border-gray-200">
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile?.avatar_url || user?.avatar} alt={profile?.full_name || user?.fullName} />
                    <AvatarFallback className="bg-slate-900 text-white text-lg font-medium">
                      {(profile?.full_name || user?.fullName)?.charAt(0).toUpperCase() || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-800">{profile?.full_name || user?.fullName || 'Tutor Name'}</h3>
                    <p className="text-sm text-gray-500">{profile?.position || 'Tutor'}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              
              <div className="px-6 space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="text-sm font-medium">{profile?.full_name || user?.fullName || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium">{user?.email || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/tutor/dashboard" className="cursor-pointer">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/tutor/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  // Student design - Keep existing light theme
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 h-16 flex items-center px-6">
      {/* Search Bar - Show only for student routes */}
      <div className="flex-1 max-w-md relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search courses, tutors..."
            className="pl-10 pr-4 w-full border-gray-200 hover:bg-[#E5D0FF] focus:border-[#8A5BB7] focus-visible:ring-[#8A5BB7]"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearching(e.target.value.length > 0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>

        {/* Search Results Dropdown - Show when typing "advanced" */}
        {isSearching && shouldShowResults && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2">
            <div className="py-2">
              {searchResults.map((result) => (
                <div 
                  key={result.id}
                  className="px-3 py-2 hover:bg-[#E5D0FF] rounded cursor-pointer"
                  onClick={() => {
                    navigate(`/explore?search=advanced`);
                    setIsSearching(false);
                  }}
                >
                  <p className="font-medium">{result.title}</p>
                  <p className="text-sm text-gray-500">By {result.tutor}</p>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-gray-100">
              <Button 
                variant="link" 
                className="w-full justify-center text-[#8A5BB7]"
                onClick={() => {
                  navigate(`/explore?search=advanced`);
                  setIsSearching(false);
                }}
              >
                View All Results
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Right Section - Home, Notifications & Profile */}
      <div className="flex items-center justify-end space-x-4 ml-auto">
        {/* Home Button */}
        <Button 
          variant="outline" 
          size="icon" 
          asChild
          className="border border-gray-200 hover:bg-[#E5D0FF] hover:text-black active:bg-[#8A5BB7] active:text-white focus:bg-[#8A5BB7] focus:text-white"
        >
          <Link to="/">
            <Home className="h-5 w-5" />
          </Link>
        </Button>

        {/* Notification Button */}
        <div className="relative">
          <Button 
            variant="outline" 
            size="icon" 
            className="relative border border-gray-200 hover:bg-[#E5D0FF] hover:text-black active:bg-[#8A5BB7] active:text-white focus:bg-[#8A5BB7] focus:text-white"
            onClick={() => setNotificationOpen(!notificationOpen)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#BA8DF1]"></span>
            )}
          </Button>
          {notificationOpen && (
            <NotificationDropdown onClose={() => setNotificationOpen(false)} />
          )}
        </div>
        
        {/* Profile Button with User Info */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 border border-gray-200 hover:bg-[#E5D0FF] hover:text-black active:bg-[#8A5BB7] active:text-white focus:bg-[#8A5BB7] focus:text-white px-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.fullName} />
                <AvatarFallback className="bg-[#8A5BB7] text-white">
                  {user?.fullName?.charAt(0).toUpperCase() || 'S'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium">{user?.fullName || 'Student'}</div>
                <div className="text-xs text-gray-500">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Student'}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Account
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/student/dashboard" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div> 
      
    </div>
  );
};

export default Topbar;
