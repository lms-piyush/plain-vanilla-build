
import { Link } from "react-router-dom";
import { 
  LayoutDashboard,
  BookOpen,
  BarChart,
  MessageSquare,
  Star,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

interface TutorMobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isActiveRoute: (path: string) => boolean;
  onLogout: () => void;
}

const TutorMobileSidebar = ({ isOpen, onOpenChange, isActiveRoute, onLogout }: TutorMobileSidebarProps) => {
  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed bottom-4 right-4 z-50 rounded-full shadow-lg">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px]">
          <SheetHeader>
            <SheetTitle className="text-purple-600">Dashboard Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-2 mt-6">
            {[
              { icon: LayoutDashboard, label: "Dashboard", href: "/tutor-dashboard", badge: null },
              { icon: BookOpen, label: "Classes", href: "/tutor-dashboard/classes", badge: "3" },
              { icon: BarChart, label: "Earnings", href: "/tutor-dashboard/earnings", badge: null },
              { icon: MessageSquare, label: "Messages", href: "/tutor-dashboard/messages", badge: "2" },
              { icon: Star, label: "Feedback", href: "/tutor-dashboard/feedback", badge: null },
            ].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                  isActiveRoute(item.href)
                    ? "bg-purple-100 text-purple-600 font-medium"
                    : "text-muted-foreground hover:bg-purple-100 hover:text-purple-600"
                }`}
                onClick={() => onOpenChange(false)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge className="ml-auto text-xs bg-purple-200 text-purple-700" variant="secondary">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
            <Separator className="my-4" />
            <Button 
              variant="ghost" 
              className="justify-start gap-3 text-muted-foreground hover:bg-purple-100 hover:text-purple-600" 
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default TutorMobileSidebar;
