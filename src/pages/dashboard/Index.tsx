
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, User, LogOut } from "lucide-react";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import FeaturedTutors from "@/components/home/FeaturedTutors";
import PopularClasses from "@/components/home/PopularClasses";
import CallToAction from "@/components/home/CallToAction";
import DashboardNavigation from "@/components/navbar/DashboardNavigation";
import MobileNavigation from "@/components/navbar/MobileNavigation";
import MenuToggle from "@/components/navbar/MenuToggle";
import { useFeaturedClasses } from "@/hooks/use-featured-classes";
import { useFeaturedTutors } from "@/hooks/use-featured-tutors";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Index = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { classes: featuredClasses, isLoading: classesLoading } = useFeaturedClasses();
  const { data: featuredTutors, isLoading: tutorsLoading } = useFeaturedTutors();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getUserDisplayRole = () => {
    if (!user) return "";
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  };

  const getDashboardRoute = () => {
    if (!user) return "/";
    
    if (user.role === "tutor") {
      return "/tutor/dashboard";
    } else if (user.role === "student" || user.role === "parent") {
      return "/student/dashboard";
    } else {
      return "/dashboard";
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      {/* Unified Dashboard Navbar */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-2 min-w-0">
            {/* Logo */}
            <div className="flex items-center min-w-0">
              <GraduationCap className="h-8 w-8 text-[#8A5BB7]" />
              <h1 className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">TalentSchool</h1>
            </div>

            {/* Desktop Navigation Dropdown Menus */}
            <div className="hidden md:block">
              <DashboardNavigation />
            </div>

            {/* Right Section - User Info or Auth Buttons */}
            <div className="flex items-center space-x-2 min-w-0">
              {isAuthenticated && user ? (
                <>
                  {/* User Profile Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.fullName} />
                          <AvatarFallback className="bg-[#8A5BB7] text-white">
                            {user.fullName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden md:block text-left">
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
                        <Link to={getDashboardRoute()} className="cursor-pointer">
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
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 whitespace-nowrap" asChild>
                    <Link to="/auth/login">Login</Link>
                  </Button>
                  <Button size="sm" className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90 text-xs sm:text-sm px-3 py-1.5 sm:px-4 whitespace-nowrap" asChild>
                    <Link to="/auth/signup">Sign Up</Link>
                  </Button>
                </>
              )}
              
              {/* Mobile Menu Toggle */}
              <div className="md:hidden">
                <MenuToggle isMenuOpen={isMenuOpen} toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <MobileNavigation isMenuOpen={isMenuOpen} />
      </header>
      
      <main className="w-full overflow-x-hidden">
        <Hero />
        {!classesLoading && <PopularClasses featuredClasses={featuredClasses} />}
        {!tutorsLoading && featuredTutors && featuredTutors.length > 0 && (
          <FeaturedTutors tutors={featuredTutors.map(tutor => ({
            id: Number(tutor.id),
            name: tutor.full_name || 'Unknown',
            title: tutor.bio || '',
            image: tutor.avatar_url || '/placeholder.svg',
            rating: tutor.average_rating || 0,
            reviews: 0,
            students: tutor.total_students || 0,
            classes: tutor.total_classes || 0,
            offeredLectureTypes: []
          }))} />
        )}
        <Categories />
        <HowItWorks />
        <Testimonials />
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
