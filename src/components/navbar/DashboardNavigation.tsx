
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';

const DashboardNavigation = () => {
  return (
    <nav className="hidden md:flex items-center space-x-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-gray-700 hover:text-[#8A5BB7] flex items-center">
            Explore Classes
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 bg-white">
          <DropdownMenuItem>
            <Link to="/explore/academic-subjects" className="w-full">
              <div className="flex flex-col">
                <span className="font-medium">Academic Subjects</span>
                <span className="text-sm text-gray-500">Math, Science, Language Arts, and more</span>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/explore/arts-creativity" className="w-full">
              <div className="flex flex-col">
                <span className="font-medium">Arts & Creativity</span>
                <span className="text-sm text-gray-500">Music, Drawing, Painting, Drama</span>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/explore/technology-coding" className="w-full">
              <div className="flex flex-col">
                <span className="font-medium">Technology & Coding</span>
                <span className="text-sm text-gray-500">Programming, Game Design, Robotics</span>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/explore/life-skills" className="w-full">
              <div className="flex flex-col">
                <span className="font-medium">Life Skills</span>
                <span className="text-sm text-gray-500">Public Speaking, Financial Literacy</span>
              </div>
            </Link>
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
        <DropdownMenuContent className="w-64 bg-white">
          <DropdownMenuItem>
            <Link to="/how-it-works/for-parents" className="w-full">
              <div className="flex flex-col">
                <span className="font-medium">For Parents</span>
                <span className="text-sm text-gray-500">Learn how our platform helps your child</span>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/how-it-works/class-formats" className="w-full">
              <div className="flex flex-col">
                <span className="font-medium">Class Formats</span>
                <span className="text-sm text-gray-500">Different class types and experiences</span>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/how-it-works/safety-quality" className="w-full">
              <div className="flex flex-col">
                <span className="font-medium">Safety & Quality</span>
                <span className="text-sm text-gray-500">Our commitment to safe online education</span>
              </div>
            </Link>
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
        <DropdownMenuContent className="w-64 bg-white">
          <DropdownMenuItem>
            <Link to="/for-tutors/become-tutor" className="w-full">
              <div className="flex flex-col">
                <span className="font-medium">Become a Tutor</span>
                <span className="text-sm text-gray-500">Start teaching on our platform</span>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/for-tutors/tutor-resources" className="w-full">
              <div className="flex flex-col">
                <span className="font-medium">Tutor Resources</span>
                <span className="text-sm text-gray-500">Tools and guides to help you succeed</span>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/for-tutors/success-stories" className="w-full">
              <div className="flex flex-col">
                <span className="font-medium">Success Stories</span>
                <span className="text-sm text-gray-500">Learn from other successful tutors</span>
              </div>
            </Link>
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
        <DropdownMenuContent className="w-64 bg-white">
          <DropdownMenuItem>
            <Link to="/resources/blog-articles" className="w-full">
              <div className="flex flex-col">
                <span className="font-medium">Blog & Articles</span>
                <span className="text-sm text-gray-500">Educational insights and tips</span>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/resources/help-center" className="w-full">
              <div className="flex flex-col">
                <span className="font-medium">Help Center</span>
                <span className="text-sm text-gray-500">FAQs and support resources</span>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/resources/learning-guides" className="w-full">
              <div className="flex flex-col">
                <span className="font-medium">Learning Guides</span>
                <span className="text-sm text-gray-500">Subject-specific resources</span>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link to="/student/help" className="text-gray-700 hover:text-[#8A5BB7] text-sm font-medium">
        Help
      </Link>
    </nav>
  );
};

export default DashboardNavigation;
