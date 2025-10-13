import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChildSelector } from "./ChildSelector";
import { AddChildDialog } from "./AddChildDialog";

interface EnrollmentChildSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (childId: string) => void;
  isProcessing?: boolean;
}

export const EnrollmentChildSelector = ({ 
  open, 
  onOpenChange, 
  onConfirm,
  isProcessing = false 
}: EnrollmentChildSelectorProps) => {
  const [selectedChild, setSelectedChild] = useState("");
  const [showAddChild, setShowAddChild] = useState(false);

  const handleConfirm = () => {
    if (selectedChild) {
      onConfirm(selectedChild);
      setSelectedChild("");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Child for Enrollment</DialogTitle>
            <DialogDescription>
              Which child would you like to enroll in this class?
            </DialogDescription>
          </DialogHeader>
          
          <ChildSelector
            value={selectedChild}
            onChange={setSelectedChild}
            onAddChild={() => setShowAddChild(true)}
            label="Child"
            required
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!selectedChild || isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm Enrollment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddChildDialog
        open={showAddChild}
        onOpenChange={setShowAddChild}
      />
    </>
  );
};
