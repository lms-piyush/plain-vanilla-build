
import React from "react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface FilterSheetProps {
  classMode: "online" | "offline";
  setClassMode: (mode: "online" | "offline") => void;
  classFormat: "live" | "recorded" | "inbound" | "outbound";
  setClassFormat: (format: "live" | "recorded" | "inbound" | "outbound") => void;
  classSize: "group" | "1-on-1";
  setClassSize: (size: "group" | "1-on-1") => void;
  classDuration: "finite" | "infinite";
  setClassDuration: (duration: "finite" | "infinite") => void;
  setFilterOpen: (open: boolean) => void;
}

const FilterSheet = ({
  classMode,
  setClassMode,
  classFormat,
  setClassFormat,
  classSize,
  setClassSize,
  classDuration,
  setClassDuration,
  setFilterOpen
}: FilterSheetProps) => {
  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle>Filters</SheetTitle>
      </SheetHeader>
      <div className="p-4 space-y-6">
        {/* Class Mode */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Class Mode</h3>
          <RadioGroup 
            value={classMode} 
            onValueChange={(value) => setClassMode(value as "online" | "offline")}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="online" id="mode-online" />
              <Label htmlFor="mode-online">Online</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="offline" id="mode-offline" />
              <Label htmlFor="mode-offline">Offline</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        {/* Class Format */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Class Format</h3>
          {classMode === "online" ? (
            <RadioGroup 
              value={classFormat} 
              onValueChange={(value) => setClassFormat(value as "live" | "recorded")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="live" id="format-live" />
                <Label htmlFor="format-live">Live</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recorded" id="format-recorded" />
                <Label htmlFor="format-recorded">Recorded</Label>
              </div>
            </RadioGroup>
          ) : (
            <RadioGroup 
              value={classFormat} 
              onValueChange={(value) => setClassFormat(value as "inbound" | "outbound")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inbound" id="format-inbound" />
                <Label htmlFor="format-inbound">Inbound</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="outbound" id="format-outbound" />
                <Label htmlFor="format-outbound">Outbound</Label>
              </div>
            </RadioGroup>
          )}
        </div>
        
        <Separator />
        
        {/* Class Size */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Class Size</h3>
          <RadioGroup 
            value={classSize} 
            onValueChange={(value) => setClassSize(value as "group" | "1-on-1")}
            className="flex flex-col space-y-1"
            disabled={classFormat === "outbound"}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="group" id="size-group" disabled={classFormat === "outbound"} />
              <Label htmlFor="size-group" className={classFormat === "outbound" ? "text-gray-400" : ""}>Group</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1-on-1" id="size-1on1" />
              <Label htmlFor="size-1on1">1-on-1</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        {/* Class Duration */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Class Duration</h3>
          <RadioGroup 
            value={classDuration} 
            onValueChange={(value) => setClassDuration(value as "finite" | "infinite")}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="finite" id="duration-finite" />
              <Label htmlFor="duration-finite">Finite classes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="infinite" id="duration-infinite" />
              <Label htmlFor="duration-infinite">Infinite classes</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button 
            className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
            onClick={() => setFilterOpen(false)}
          >
            Save Filters
          </Button>
        </div>
      </div>
    </SheetContent>
  );
};

export default FilterSheet;
