
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
import { LayoutDashboard, Book, Compass, HelpCircle, LogOut, MessagesSquare } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Book, label: "My Classes", path: "/my-classes" },
    { icon: Compass, label: "Explore Classes", path: "/explore" },
    { icon: MessagesSquare, label: "Messages", path: "/messages" },
    { icon: HelpCircle, label: "Help", path: "/help" },
  ];

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
          <button className="flex items-center space-x-2">
            <LogOut />
            <span>Logout</span>
          </button>
        </SidebarMenuButton>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
