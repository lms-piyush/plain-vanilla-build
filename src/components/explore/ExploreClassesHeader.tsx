
import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExploreClassesHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  wishlistedCourses: string[];
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  children: React.ReactNode; // For FilterSheet content
}

const ExploreClassesHeader = ({
  activeTab,
  setActiveTab,
  sortBy,
  setSortBy,
  wishlistedCourses,
  filterOpen,
  setFilterOpen,
  children
}: ExploreClassesHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
      <Tabs defaultValue={activeTab} className="mb-8 w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Classes</TabsTrigger>
            <TabsTrigger value="saved">Saved Classes ({wishlistedCourses.length})</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rating</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
            
            {activeTab === "all" && (
              <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </SheetTrigger>
                {children}
              </Sheet>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ExploreClassesHeader;
