
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classDetails: any;
}

const AddressModal = ({ open, onOpenChange, classDetails }: AddressModalProps) => {
  const { toast } = useToast();
  const location = classDetails?.class_locations?.[0];

  const copyAddress = () => {
    if (!location) return;
    
    const addressParts = [
      location.street,
      location.city,
      location.state,
      location.zip_code,
      location.country
    ].filter(Boolean);
    
    const fullAddress = addressParts.join(', ');
    navigator.clipboard.writeText(fullAddress);
    
    toast({
      title: "Address copied",
      description: "Class address has been copied to clipboard",
    });
  };

  if (!location) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Class Location</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-muted-foreground">No address information available</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Class Location
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              {location.street && (
                <p className="font-medium">{location.street}</p>
              )}
              <div className="text-sm text-muted-foreground space-y-1">
                {location.city && <p>{location.city}</p>}
                {location.state && <p>{location.state}</p>}
                {location.zip_code && <p>{location.zip_code}</p>}
                {location.country && <p>{location.country}</p>}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={copyAddress} className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Copy Address
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;
