
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import DesktopNavigationItem from './DesktopNavigationItem';
import { 
  exploreClassesItems, 
  howItWorksItems, 
  forTutorsItems, 
  resourcesItems 
} from './NavigationData';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DesktopNavigation = () => {
  const { isAuthenticated, user, logout } = useAuth();

  // Determine the correct dashboard URL based on user role
  const getDashboardUrl = () => {
    if (!user) return "/dashboard";
    
    switch (user.role) {
      case "tutor":
        return "/tutor/dashboard";
      case "student":
      case "parent":
        return "/student/dashboard";
      default:
        return "/dashboard";
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getUserDisplayRole = () => {
    if (!user) return "";
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  };

  return (
    <>
      <div className="hidden md:flex items-center space-x-1">
        <NavigationMenu>
          <NavigationMenuList>
            <DesktopNavigationItem label="Explore Classes" items={exploreClassesItems} />
            <DesktopNavigationItem label="How It Works" items={howItWorksItems} />
            <DesktopNavigationItem label="For Tutors" items={forTutorsItems} />
            <DesktopNavigationItem label="Resources" items={resourcesItems} />
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      <div className="hidden md:flex items-center gap-3">
        {isAuthenticated && user ? (
          <>
            <Button className="bg-talent-primary hover:bg-talent-secondary text-white font-medium transition-all" asChild>
              <Link to={getDashboardUrl()}>Go to {getUserDisplayRole()} Dashboard</Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.fullName} />
                    <AvatarFallback className="bg-talent-primary text-white">
                      {user.fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                    <div className="text-xs text-gray-500">{getUserDisplayRole()}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">{getUserDisplayRole()} Account</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={getDashboardUrl()} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button variant="ghost" className="font-medium" asChild>
              <Link to="/auth/login">Log In</Link>
            </Button>
            <Button className="bg-talent-primary hover:bg-talent-secondary text-white font-medium transition-all" asChild>
              <Link to="/auth/signup">Sign Up Free</Link>
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default DesktopNavigation;
