
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface FilterSheetProps {
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  classMode: "online" | "offline";
  setClassMode: (mode: "online" | "offline") => void;
  classFormat: "live" | "recorded" | "inbound" | "outbound";
  setClassFormat: (format: "live" | "recorded" | "inbound" | "outbound") => void;
  classSize: "group" | "1-on-1";
  setClassSize: (size: "group" | "1-on-1") => void;
  classDuration: "finite" | "infinite";
  setClassDuration: (duration: "finite" | "infinite") => void;
  paymentModel: "one-time" | "subscription";
  setPaymentModel: (model: "one-time" | "subscription") => void;
  onApplyFilters: () => void;
}

const FilterSheet = ({
  filterOpen,
  setFilterOpen,
  classMode,
  setClassMode,
  classFormat,
  setClassFormat,
  classSize,
  setClassSize,
  classDuration,
  setClassDuration,
  paymentModel,
  setPaymentModel,
  onApplyFilters,
}: FilterSheetProps) => {
  
  const handleSaveFilters = () => {
    console.log("FilterSheet - Saving filters:", {
      classMode,
      classFormat,
      classSize,
      classDuration,
      paymentModel
    });
    onApplyFilters();
    setFilterOpen(false);
  };

  console.log("FilterSheet - Current filter values:", {
    classMode,
    classFormat,
    classSize,
    classDuration,
    paymentModel
  });
  return (
    <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </SheetTrigger>
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
          
          <Separator />
          
          {/* Payment Model */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Payment Model</h3>
            <RadioGroup 
              value={paymentModel} 
              onValueChange={(value) => setPaymentModel(value as "one-time" | "subscription")}
              className="flex flex-col space-y-1"
              disabled={classDuration === "infinite"}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one-time" id="payment-onetime" disabled={classDuration === "infinite"} />
                <Label htmlFor="payment-onetime" className={classDuration === "infinite" ? "text-gray-400" : ""}>One-time payment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="subscription" id="payment-subscription" />
                <Label htmlFor="payment-subscription">Subscription</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
              onClick={handleSaveFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
