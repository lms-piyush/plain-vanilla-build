
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/hooks/use-toast";

export const useTutorLayoutState = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [location, isMobile]);

  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You have been logged out successfully.",
    });
    logout();
    navigate("/");
  };

  const isActiveRoute = (path: string) => {
    if (path === "/tutor-dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return {
    user,
    isMobile,
    isSidebarOpen,
    setIsSidebarOpen,
    handleLogout,
    isActiveRoute,
    navigate
  };
};
