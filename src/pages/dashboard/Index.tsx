
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
                  <DropdownMenuItem>
                    <Link to="/explore/academic-subjects" className="w-full">Academic Subjects</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/explore/arts-creativity" className="w-full">Arts & Creativity</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/explore/technology-coding" className="w-full">Technology & Coding</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/explore/life-skills" className="w-full">Life Skills</Link>
                  </DropdownMenuItem>
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
                  <DropdownMenuItem>
                    <Link to="/how-it-works/for-parents" className="w-full">For Parents</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/how-it-works/class-formats" className="w-full">Class Formats</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/how-it-works/safety-quality" className="w-full">Safety & Quality</Link>
                  </DropdownMenuItem>
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
                  <DropdownMenuItem>
                    <Link to="/for-tutors/become-tutor" className="w-full">Become a Tutor</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/for-tutors/tutor-resources" className="w-full">Tutor Resources</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/for-tutors/success-stories" className="w-full">Success Stories</Link>
                  </DropdownMenuItem>
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
                  <DropdownMenuItem>
                    <Link to="/resources/help-center" className="w-full">Help Center</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/resources/blog-articles" className="w-full">Blog Articles</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/resources/learning-guides" className="w-full">Learning Guides</Link>
                  </DropdownMenuItem>
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
