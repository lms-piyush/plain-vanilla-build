import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StudentClassDetails } from "@/hooks/use-student-class-details";

interface AddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classDetails: StudentClassDetails;
}

const AddressModal = ({ open, onOpenChange, classDetails }: AddressModalProps) => {
  const location = classDetails.class_locations?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Class Location</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <div className="space-y-2">
            <p><strong>Class:</strong> {classDetails.title}</p>
            {location?.meeting_link && (
              <p><strong>Meeting Link:</strong> 
                <a href={location.meeting_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                  Join Class
                </a>
              </p>
            )}
            {location && (location.street || location.city || location.state) && (
              <div>
                <strong>Address:</strong>
                <div className="ml-2 text-sm text-muted-foreground">
                  {location.street && <p>{location.street}</p>}
                  {location.city && location.state && (
                    <p>{location.city}, {location.state}</p>
                  )}
                  {location.zip_code && <p>{location.zip_code}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;