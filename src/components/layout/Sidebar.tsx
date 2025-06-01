import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar as SidebarComponent, 
  SidebarContent, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Book, 
  Compass, 
  HelpCircle, 
  LogOut, 
  MessagesSquare,
  DollarSign,
  ThumbsUp,
  Users,
  BarChart3,
  Settings
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const isTutorRoute = location.pathname.startsWith('/tutor');

  // Student navigation items
  const studentMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Book, label: "My Classes", path: "/my-classes" },
    { icon: Compass, label: "Explore Classes", path: "/explore" },
    { icon: MessagesSquare, label: "Messages", path: "/messages" },
    { icon: HelpCircle, label: "Help", path: "/help" },
  ];

  // Tutor navigation items - only essential ones
  const tutorMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/tutor/dashboard" },
    { icon: Book, label: "Classes", path: "/tutor/classes" },
    { icon: DollarSign, label: "Earnings", path: "/tutor/earnings" },
    { icon: MessagesSquare, label: "Messages", path: "/tutor/messages" },
    { icon: ThumbsUp, label: "Feedback", path: "/tutor/feedback" },
  ];

  const menuItems = isTutorRoute ? tutorMenuItems : studentMenuItems;

  if (isTutorRoute) {
    // Tutor sidebar - White theme
    return (
      <SidebarComponent className="border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TS</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">TalentSchool</h1>
          </div>
        </div>
        
        <SidebarContent className="flex flex-col justify-between flex-1 bg-white">
          <div className="pt-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path} className="py-1 mx-2">
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    className={isActive(item.path) 
                      ? "bg-slate-900 text-white shadow-sm" 
                      : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"}
                  >
                    <Link to={item.path} className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-all">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </SidebarContent>
        
        <SidebarFooter className="border-t border-gray-200 p-4 bg-white">
          <SidebarMenuButton 
            asChild 
            className="w-full hover:bg-red-50 hover:text-red-600 text-gray-700 transition-colors"
          >
            <Link to="/" className="flex items-center space-x-2 px-3 py-2 rounded-lg">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Link>
          </SidebarMenuButton>
        </SidebarFooter>
      </SidebarComponent>
    );
  }

  // Student sidebar - Keep existing light theme
  return (
    <SidebarComponent>
      <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
        <h1 className="text-xl font-semibold">TalentSchool</h1>
      </div>
      <SidebarContent className="flex flex-col justify-between flex-1">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path} className="py-1">
              <SidebarMenuButton
                asChild
                isActive={isActive(item.path)}
                className={isActive(item.path) 
                  ? "bg-[#8A5BB7] text-white" 
                  : "hover:bg-[#E5D0FF] hover:text-black"}
              >
                <Link to={item.path}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4 mt-8">
        <SidebarMenuButton 
          asChild 
          className="w-full hover:bg-[#E5D0FF] hover:text-black active:bg-[#8A5BB7] active:text-white"
        >
          <Link to="/" className="flex items-center space-x-2">
            <LogOut />
            <span>Logout</span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
