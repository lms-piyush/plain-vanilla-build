
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ChevronDown } from 'lucide-react';

const DashboardNavigation = () => {
  return (
    <nav className="hidden md:flex items-center space-x-6">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger asChild>
              <Link 
                to="/student/explore"
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#8A5BB7] transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
              >
                Explore Classes
                <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
              </Link>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="z-50">
              <ul className="grid w-[400px] gap-3 p-4 bg-white">
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/student/explore"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">All Classes</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Browse all available classes
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/explore/academic-subjects"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Academic Subjects</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Math, Science, Language Arts, and more
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/explore/arts-creativity"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Arts & Creativity</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Music, Drawing, Painting, Drama
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/explore/technology-coding"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Technology & Coding</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Programming, Game Design, Robotics
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/explore/life-skills"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Life Skills</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Public Speaking, Financial Literacy
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-gray-700 hover:text-[#8A5BB7] bg-transparent">
              How It Works
            </NavigationMenuTrigger>
            <NavigationMenuContent className="z-50">
              <ul className="grid w-[400px] gap-3 p-4 bg-white">
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/how-it-works/for-parents"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">For Parents</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Learn how our platform helps your child
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/how-it-works/class-formats"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Class Formats</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Different class types and experiences
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/how-it-works/safety-quality"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Safety & Quality</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Our commitment to safe online education
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-gray-700 hover:text-[#8A5BB7] bg-transparent">
              For Tutors
            </NavigationMenuTrigger>
            <NavigationMenuContent className="z-50">
              <ul className="grid w-[400px] gap-3 p-4 bg-white">
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/for-tutors/become-tutor"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Become a Tutor</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Start teaching on our platform
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/for-tutors/tutor-resources"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Tutor Resources</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Tools and guides to help you succeed
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/for-tutors/success-stories"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Success Stories</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Learn from other successful tutors
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-gray-700 hover:text-[#8A5BB7] bg-transparent">
              Resources
            </NavigationMenuTrigger>
            <NavigationMenuContent className="z-50">
              <ul className="grid w-[400px] gap-3 p-4 bg-white">
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/resources/blog-articles"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Blog & Articles</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Educational insights and tips
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/resources/help-center"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Help Center</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        FAQs and support resources
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link 
                      to="/resources/learning-guides"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Learning Guides</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Subject-specific resources
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <Link to="/student/help" className="text-gray-700 hover:text-[#8A5BB7] text-sm font-medium">
        Help
      </Link>
    </nav>
  );
};

export default DashboardNavigation;
