
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard,
  BookOpen,
  BarChart,
  MessageSquare,
  Star,
  User,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TutorDesktopSidebarProps {
  isSidebarOpen: boolean;
  onLogout: () => void;
}

const TutorDesktopSidebar = ({ isSidebarOpen, onLogout }: TutorDesktopSidebarProps) => {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    if (path === "/tutor/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`hidden md:block ${isSidebarOpen ? 'col-span-2 lg:col-span-2 xl:col-span-2' : 'col-span-1'} transition-all duration-300 border-r bg-background`}>
      <div className="flex flex-col h-full p-2 gap-1">
        <Link
          to="/tutor/dashboard"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
            isActiveRoute("/tutor/dashboard") && location.pathname === "/tutor/dashboard"
              ? "bg-primary text-primary-foreground font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          aria-current={isActiveRoute("/tutor/dashboard") ? "page" : undefined}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {isSidebarOpen && <span className="truncate">Dashboard</span>}
        </Link>
        
        <Link
          to="/tutor/classes"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
            isActiveRoute("/tutor/classes")
              ? "bg-primary text-primary-foreground font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          aria-current={isActiveRoute("/tutor/classes") ? "page" : undefined}
        >
          <BookOpen className="h-4 w-4 shrink-0" />
          {isSidebarOpen && <span className="truncate">Classes</span>}
        </Link>
        
        <Link
          to="/tutor/earnings"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
            isActiveRoute("/tutor/earnings")
              ? "bg-primary text-primary-foreground font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          aria-current={isActiveRoute("/tutor/earnings") ? "page" : undefined}
        >
          <BarChart className="h-4 w-4 shrink-0" />
          {isSidebarOpen && <span className="truncate">Earnings</span>}
        </Link>
        
        <Link
          to="/tutor/messages"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
            isActiveRoute("/tutor/messages")
              ? "bg-primary text-primary-foreground font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          aria-current={isActiveRoute("/tutor/messages") ? "page" : undefined}
        >
          <MessageSquare className="h-4 w-4 shrink-0" />
          {isSidebarOpen && <span className="truncate">Messages</span>}
        </Link>
        
        <Link
          to="/tutor/feedback"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
            isActiveRoute("/tutor/feedback")
              ? "bg-primary text-primary-foreground font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          aria-current={isActiveRoute("/tutor/feedback") ? "page" : undefined}
        >
          <Star className="h-4 w-4 shrink-0" />
          {isSidebarOpen && <span className="truncate">Feedback</span>}
        </Link>
        
        <Link
          to="/tutor/profile"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
            isActiveRoute("/tutor/profile")
              ? "bg-primary text-primary-foreground font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          aria-current={isActiveRoute("/tutor/profile") ? "page" : undefined}
        >
          <User className="h-4 w-4 shrink-0" />
          {isSidebarOpen && <span className="truncate">Profile</span>}
        </Link>
        
        <Link
          to="/tutor/help"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
            isActiveRoute("/tutor/help")
              ? "bg-primary text-primary-foreground font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          aria-current={isActiveRoute("/tutor/help") ? "page" : undefined}
        >
          <HelpCircle className="h-4 w-4 shrink-0" />
          {isSidebarOpen && <span className="truncate">Help</span>}
        </Link>

        <div className="mt-auto pt-4">
          <Separator className="mb-2" />
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-3 text-muted-foreground hover:bg-muted hover:text-foreground ${!isSidebarOpen ? 'px-3' : ''}`}
            onClick={onLogout}
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {isSidebarOpen && <span className="text-sm">Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default TutorDesktopSidebar;
