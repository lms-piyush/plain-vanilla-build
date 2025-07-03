import { useState, useEffect } from "react";
import { useClassCreationStore, DeliveryMode, ClassFormat, ClassSize, DurationType } from "@/hooks/use-class-creation-store";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface ClassTypeStepProps {
  onNext: () => void;
}

const ClassTypeStep = ({ onNext }: ClassTypeStepProps) => {
  const store = useClassCreationStore();
  const { 
    deliveryMode,
    classFormat,
    classSize,
    durationType,
    setDeliveryMode, 
    setClassFormat, 
    setClassSize, 
    setDurationType 
  } = store;
  
  const [isValid, setIsValid] = useState(false);
  
  // Validate if all required fields are filled
  useEffect(() => {
    // Special cases where classSize is not required:
    // 1. For inbound classes, classSize is always "one-on-one"
    // 2. For recorded classes, classSize is not needed
    const isClassSizeValid = 
      classFormat === "inbound" || 
      classFormat === "recorded" ||
      (classSize !== null && classSize !== undefined);
    
    setIsValid(
      !!deliveryMode && 
      !!classFormat && 
      isClassSizeValid && 
      !!durationType
    );
  }, [deliveryMode, classFormat, classSize, durationType]);

  // Auto-set class size for recorded classes
  useEffect(() => {
    if (classFormat === "recorded") {
      setClassSize("group"); // Default to group for recorded classes
    }
  }, [classFormat, setClassSize]);
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Delivery Mode</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select how you want to deliver your class
        </p>
        
        <RadioGroup 
          defaultValue={deliveryMode || undefined}
          onValueChange={(value) => setDeliveryMode(value as DeliveryMode)}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="online" id="online" className="mt-1" />
            <Label 
              htmlFor="online" 
              className="flex flex-col cursor-pointer"
            >
              <span className="font-medium">Online</span>
              <span className="text-sm text-muted-foreground">
                Teach virtually from anywhere
              </span>
            </Label>
          </div>
          
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="offline" id="offline" className="mt-1" />
            <Label 
              htmlFor="offline"
              className="flex flex-col cursor-pointer"
            >
              <span className="font-medium">Offline</span>
              <span className="text-sm text-muted-foreground">
                Teach in-person
              </span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {deliveryMode && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Class Format</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose the format that best suits your teaching style
          </p>
          
          <Select 
            value={classFormat || undefined}
            onValueChange={(value) => setClassFormat(value as ClassFormat)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select class format" />
            </SelectTrigger>
            <SelectContent>
              {deliveryMode === "online" ? (
                <>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="recorded">Recorded</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="inbound">Inbound (you go to student)</SelectItem>
                  <SelectItem value="outbound">Outbound (student comes to you)</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {classFormat && classFormat !== "inbound" && classFormat !== "recorded" && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Class Size</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select whether you want to teach a group or one-on-one
          </p>
          
          <RadioGroup 
            defaultValue={classSize || undefined}
            onValueChange={(value) => setClassSize(value as ClassSize)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="group" id="group" className="mt-1" />
              <Label 
                htmlFor="group"
                className="flex flex-col cursor-pointer" 
              >
                <span className="font-medium">Group</span>
                <span className="text-sm text-muted-foreground">
                  Teach multiple students at once
                </span>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="one-on-one" id="one-on-one" className="mt-1" />
              <Label 
                htmlFor="one-on-one"
                className="flex flex-col cursor-pointer"
              >
                <span className="font-medium">One-on-One</span>
                <span className="text-sm text-muted-foreground">
                  Personalized teaching for a single student
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}
      
      {(classSize || classFormat === "inbound" || classFormat === "recorded") && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Payment Type</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose between recurring or fixed duration classes
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-md">
              <Label className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Recurring</span>
                  <p className="text-sm text-muted-foreground">
                    Ongoing classes with a monthly subscription
                  </p>
                </div>
                <Switch
                  checked={durationType === "recurring"}
                  onCheckedChange={() => setDurationType("recurring")}
                />
              </Label>
            </div>
            
            <div className="p-4 border rounded-md">
              <Label className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Fixed Duration</span>
                  <p className="text-sm text-muted-foreground">
                    Set number of sessions with a one-time payment
                  </p>
                </div>
                <Switch
                  checked={durationType === "fixed"}
                  onCheckedChange={() => setDurationType("fixed")}
                />
              </Label>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button 
          onClick={onNext} 
          disabled={!isValid}
          className="bg-[#1F4E79] hover:bg-[#1a4369]"
        >
          Continue to Details
        </Button>
      </div>
    </div>
  );
};

export default ClassTypeStep;
