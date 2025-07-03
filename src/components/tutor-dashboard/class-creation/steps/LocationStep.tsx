
import { useState } from "react";
import { useClassCreationStore } from "@/hooks/use-class-creation-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LocationStepProps {
  onNext: () => void;
  onBack: () => void;
}

const LocationStep = ({ onNext, onBack }: LocationStepProps) => {
  const store = useClassCreationStore();
  
  const [meetingLink, setMeetingLink] = useState(store.meetingLink);
  const [address, setAddress] = useState(store.address);
  
  const [errors, setErrors] = useState({
    meetingLink: "",
    address: ""
  });
  
  const validateForm = () => {
    const newErrors = {
      meetingLink: "",
      address: ""
    };
    
    if (store.deliveryMode === "online" && store.classFormat === "live" && !meetingLink) {
      newErrors.meetingLink = "Meeting link is required for live online classes";
    }
    
    if (store.deliveryMode === "offline" && !address.street && !address.city) {
      newErrors.address = "Address is required for offline classes";
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleNext = () => {
    if (validateForm()) {
      store.setLocation({
        meetingLink,
        address
      });
      onNext();
    }
  };
  
  const handleAddressChange = (field: keyof typeof address, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {store.deliveryMode === "online" && (
            <div className="space-y-2">
              <Label htmlFor="meetingLink" className="text-base">
                Meeting Link {store.classFormat === "live" && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="meetingLink"
                placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className={errors.meetingLink ? "border-red-500" : ""}
              />
              {errors.meetingLink && (
                <p className="text-red-500 text-sm">{errors.meetingLink}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Students will receive this link after enrollment
              </p>
            </div>
          )}
          
          {store.deliveryMode === "offline" && (
            <div className="space-y-4">
              <Label className="text-base">
                Class Location {store.classFormat !== "inbound" && <span className="text-red-500">*</span>}
              </Label>
              
              <div className="space-y-3">
                <Input
                  placeholder="Street Address"
                  value={address.street}
                  onChange={(e) => handleAddressChange("street", e.target.value)}
                  className={errors.address ? "border-red-500" : ""}
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  <Input
                    placeholder="State"
                    value={address.state}
                    onChange={(e) => handleAddressChange("state", e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="ZIP Code"
                    value={address.zipCode}
                    onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                  />
                  <Input
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) => handleAddressChange("country", e.target.value)}
                  />
                </div>
              </div>
              
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Delivery Mode:</span>
                  <span className="ml-2 capitalize">{store.deliveryMode}</span>
                </div>
                
                <div>
                  <span className="font-medium">Format:</span>
                  <span className="ml-2 capitalize">{store.classFormat}</span>
                </div>
                
                {store.deliveryMode === "online" && (
                  <div>
                    <span className="font-medium">Meeting Link:</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {meetingLink || "Not set"}
                    </span>
                  </div>
                )}
                
                {store.deliveryMode === "offline" && (
                  <div>
                    <span className="font-medium">Address:</span>
                    <div className="ml-2 text-sm text-muted-foreground">
                      {address.street || address.city 
                        ? `${address.street}, ${address.city}, ${address.state} ${address.zipCode}` 
                        : "Not set"
                      }
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-medium text-[#1F4E79] mb-2">Location Tips</h4>
            <ul className="text-sm space-y-2 list-disc list-inside text-gray-700">
              {store.deliveryMode === "online" ? (
                <>
                  <li>Use reliable video conferencing platforms</li>
                  <li>Test your meeting link before the first class</li>
                  <li>Consider backup communication methods</li>
                  <li>Ensure stable internet connection</li>
                </>
              ) : (
                <>
                  <li>Choose a quiet, well-lit location</li>
                  <li>Ensure the space is appropriate for learning</li>
                  <li>Consider parking and accessibility</li>
                  <li>Provide clear directions to students</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          onClick={handleNext}
          className="bg-[#1F4E79] hover:bg-[#1a4369]"
        >
          Continue to Curriculum
        </Button>
      </div>
    </div>
  );
};

export default LocationStep;
