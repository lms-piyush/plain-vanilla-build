
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useTutorProfile } from "@/hooks/use-tutor-profile";

interface TutorLayoutHeaderProps {
  onLogout: () => void;
}

const TutorLayoutHeader = ({ onLogout }: TutorLayoutHeaderProps) => {
  const { user } = useAuth();
  const { profile } = useTutorProfile(user?.id);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center mr-4">
            <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
              Logo
            </div>
          </Link>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex items-center gap-1 text-xs"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Help</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border border-purple-200">
                  <AvatarImage src={profile?.avatar_url || user?.avatar} alt={profile?.full_name || user?.fullName} />
                  <AvatarFallback className="bg-purple-600 text-white">{(profile?.full_name || user?.fullName)?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{profile?.full_name || user?.fullName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{profile?.position || user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/tutor/dashboard" className="cursor-pointer">
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/tutor/profile" className="cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TutorLayoutHeader;
