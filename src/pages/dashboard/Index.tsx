
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GraduationCap, ChevronDown } from "lucide-react";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import FeaturedTutors from "@/components/home/FeaturedTutors";
import PopularClasses from "@/components/home/PopularClasses";
import CallToAction from "@/components/home/CallToAction";
import { tutors, featuredClasses } from "@/components/home/data";
import { 
  exploreClassesItems, 
  howItWorksItems, 
  forTutorsItems, 
  resourcesItems 
} from '@/components/navbar/NavigationData';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Enhanced Landing Navbar with Dropdown Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-[#8A5BB7]" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">TalentSchool</h1>
            </div>

            {/* Navigation Dropdown Menus */}
            <nav className="hidden md:flex items-center space-x-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-700 hover:text-[#8A5BB7] flex items-center">
                    Explore Classes
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white">
                  {exploreClassesItems.map((item) => (
                    <DropdownMenuItem key={item.title}>
                      <Link to={item.href} className="w-full">{item.title}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-700 hover:text-[#8A5BB7] flex items-center">
                    How It Works
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white">
                  {howItWorksItems.map((item) => (
                    <DropdownMenuItem key={item.title}>
                      <Link to={item.href} className="w-full">{item.title}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-700 hover:text-[#8A5BB7] flex items-center">
                    For Tutors
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white">
                  {forTutorsItems.map((item) => (
                    <DropdownMenuItem key={item.title}>
                      <Link to={item.href} className="w-full">{item.title}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-gray-700 hover:text-[#8A5BB7] flex items-center">
                    Resources
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white">
                  {resourcesItems.map((item) => (
                    <DropdownMenuItem key={item.title}>
                      <Link to={item.href} className="w-full">{item.title}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            <div className="flex space-x-4">
              <Button variant="outline" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/student">Student Login</Link>
              </Button>
              <Button asChild className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90">
                <Link to="/tutor">Tutor Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        <Hero />
        <PopularClasses featuredClasses={featuredClasses} />
        <FeaturedTutors tutors={tutors} />
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
