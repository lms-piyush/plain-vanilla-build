
import { ReactNode } from "react";
import TutorLayoutHeader from "./tutor-dashboard/layout/TutorLayoutHeader";
import TutorDesktopSidebar from "./tutor-dashboard/layout/TutorDesktopSidebar";
import TutorMobileSidebar from "./tutor-dashboard/layout/TutorMobileSidebar";
import AccessibilitySkipLink from "./tutor-dashboard/layout/AccessibilitySkipLink";
import { useTutorLayoutState } from "./tutor-dashboard/layout/useTutorLayoutState";

interface TutorDashboardLayoutProps {
  children: ReactNode;
}

const TutorDashboardLayout = ({ children }: TutorDashboardLayoutProps) => {
  const {
    user,
    isMobile,
    isSidebarOpen,
    setIsSidebarOpen,
    handleLogout,
    isActiveRoute,
    navigate
  } = useTutorLayoutState();

  if (!user || user.role !== "tutor") {
    navigate("/auth/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AccessibilitySkipLink />
      
      <TutorLayoutHeader onLogout={handleLogout} />

      <div className="grid grid-cols-12 min-h-[calc(100vh-4rem)] pt-16">
        <TutorDesktopSidebar 
          isSidebarOpen={isSidebarOpen} 
          onLogout={handleLogout} 
        />

        {isMobile && (
          <TutorMobileSidebar 
            isOpen={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
            isActiveRoute={isActiveRoute}
            onLogout={handleLogout}
          />
        )}

        <main 
          id="main-content" 
          tabIndex={-1} 
          className={`${isSidebarOpen ? 'col-span-12 md:col-span-10 lg:col-span-10 xl:col-span-10' : 'col-span-12 md:col-span-11'} transition-all duration-300 overflow-auto p-4 md:p-6 bg-[#f8fafc]`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default TutorDashboardLayout;
