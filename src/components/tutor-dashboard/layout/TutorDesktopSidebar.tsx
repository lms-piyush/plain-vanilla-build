
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard,
  BookOpen,
  BarChart,
  MessageSquare,
  Star,
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
    if (path === "/tutor-dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`hidden md:block ${isSidebarOpen ? 'col-span-2 lg:col-span-2 xl:col-span-2' : 'col-span-1'} transition-all duration-300 border-r bg-background`}>
      <div className="flex flex-col h-full p-2 gap-1">
        <Link
          to="/tutor-dashboard"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
            isActiveRoute("/tutor-dashboard") && location.pathname === "/tutor-dashboard"
              ? "bg-purple-600 text-white font-medium"
              : "text-muted-foreground hover:bg-purple-100 hover:text-purple-600"
          }`}
          aria-current={isActiveRoute("/tutor-dashboard") ? "page" : undefined}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {isSidebarOpen && <span className="truncate">Dashboard</span>}
        </Link>
        
        <Link
          to="/tutor-dashboard/classes"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
            isActiveRoute("/tutor-dashboard/classes")
              ? "bg-purple-100 text-purple-600 font-medium"
              : "text-muted-foreground hover:bg-purple-100 hover:text-purple-600"
          }`}
          aria-current={isActiveRoute("/tutor-dashboard/classes") ? "page" : undefined}
        >
          <BookOpen className="h-4 w-4 shrink-0" />
          {isSidebarOpen && (
            <>
              <span className="truncate">Classes</span>
              <Badge className="ml-auto text-xs bg-purple-200 text-purple-700" variant="secondary">
                3
              </Badge>
            </>
          )}
        </Link>
        
        <Link
          to="/tutor-dashboard/earnings"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
            isActiveRoute("/tutor-dashboard/earnings")
              ? "bg-purple-100 text-purple-600 font-medium"
              : "text-muted-foreground hover:bg-purple-100 hover:text-purple-600"
          }`}
          aria-current={isActiveRoute("/tutor-dashboard/earnings") ? "page" : undefined}
        >
          <BarChart className="h-4 w-4 shrink-0" />
          {isSidebarOpen && <span className="truncate">Earnings</span>}
        </Link>
        
        <Link
          to="/tutor-dashboard/messages"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
            isActiveRoute("/tutor-dashboard/messages")
              ? "bg-purple-100 text-purple-600 font-medium"
              : "text-muted-foreground hover:bg-purple-100 hover:text-purple-600"
          }`}
          aria-current={isActiveRoute("/tutor-dashboard/messages") ? "page" : undefined}
        >
          <MessageSquare className="h-4 w-4 shrink-0" />
          {isSidebarOpen && (
            <>
              <span className="truncate">Messages</span>
              <Badge className="ml-auto text-xs bg-purple-200 text-purple-700" variant="secondary">
                2
              </Badge>
            </>
          )}
        </Link>
        
        <Link
          to="/tutor-dashboard/feedback"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
            isActiveRoute("/tutor-dashboard/feedback")
              ? "bg-purple-100 text-purple-600 font-medium"
              : "text-muted-foreground hover:bg-purple-100 hover:text-purple-600"
          }`}
          aria-current={isActiveRoute("/tutor-dashboard/feedback") ? "page" : undefined}
        >
          <Star className="h-4 w-4 shrink-0" />
          {isSidebarOpen && <span className="truncate">Feedback</span>}
        </Link>

        <div className="mt-auto pt-4">
          <Separator className="mb-2" />
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-3 text-muted-foreground hover:bg-purple-100 hover:text-purple-600 ${!isSidebarOpen ? 'px-3' : ''}`}
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
