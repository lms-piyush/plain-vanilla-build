
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Topbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Dummy search results for "advanced" keyword
  const searchResults = [
    { id: "adv1", title: "Advanced Mathematics", tutor: "Prof. Johnson" },
    { id: "adv2", title: "Advanced Python Programming", tutor: "Dr. Smith" },
    { id: "adv3", title: "Advanced Data Structures", tutor: "Sarah Lee" },
    { id: "adv4", title: "Advanced UI/UX Design", tutor: "Michael Chen" },
    { id: "adv5", title: "Advanced Machine Learning", tutor: "Emma Watson" }
  ];

  const shouldShowResults = searchQuery.toLowerCase().includes("advanced");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
      setIsSearching(false);
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 h-16 flex items-center px-6">
      {/* Search Bar - Now on the left side */}
      <div className="flex-1 max-w-md relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search courses, tutors..."
            className="pl-10 pr-4 w-full border-gray-200 hover:bg-[#E5D0FF] focus:border-[#8A5BB7] focus-visible:ring-[#8A5BB7]"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearching(e.target.value.length > 0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>

        {/* Search Results Dropdown - Show when typing "advanced" */}
        {isSearching && shouldShowResults && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2">
            <div className="py-2">
              {searchResults.map((result) => (
                <div 
                  key={result.id}
                  className="px-3 py-2 hover:bg-[#E5D0FF] rounded cursor-pointer"
                  onClick={() => {
                    navigate(`/explore?search=advanced`);
                    setIsSearching(false);
                  }}
                >
                  <p className="font-medium">{result.title}</p>
                  <p className="text-sm text-gray-500">By {result.tutor}</p>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-gray-100">
              <Button 
                variant="link" 
                className="w-full justify-center text-[#8A5BB7]"
                onClick={() => {
                  navigate(`/explore?search=advanced`);
                  setIsSearching(false);
                }}
              >
                View All Results
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Right Section - Notifications & Profile */}
      <div className="flex items-center justify-end space-x-4 ml-auto">
        {/* Notification Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="relative border border-gray-200 hover:bg-[#E5D0FF] hover:text-black active:bg-[#8A5BB7] active:text-white focus:bg-[#8A5BB7] focus:text-white"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#BA8DF1]"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 font-medium border-b">Notifications</div>
            <DropdownMenuItem className="p-3 cursor-pointer">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span className="font-medium">Payment Successful</span>
                </div>
                <p className="text-sm text-gray-500">Your payment for 'Advanced Algebra' class was successful.</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 cursor-pointer">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-orange-500">🔥</span>
                  <span className="font-medium">New Popular Classes</span>
                </div>
                <p className="text-sm text-gray-500">New popular classes have been curated just for you. Check them out now!</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 cursor-pointer">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">📅</span>
                  <span className="font-medium">Class Reminder</span>
                </div>
                <p className="text-sm text-gray-500">Reminder: Your 'Physics Class' starts in 30 minutes.</p>
              </div>
            </DropdownMenuItem>
            <div className="p-2 border-t">
              <Button variant="ghost" className="w-full text-[#8A5BB7]">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Profile Button */}
        <Button 
          variant="outline" 
          asChild 
          className="flex items-center space-x-2 border border-gray-200 hover:bg-[#E5D0FF] hover:text-black active:bg-[#8A5BB7] active:text-white focus:bg-[#8A5BB7] focus:text-white px-3"
        >
          <Link to="/profile">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-[#8A5BB7] flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium hidden md:inline-block">Student</span>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Topbar;
