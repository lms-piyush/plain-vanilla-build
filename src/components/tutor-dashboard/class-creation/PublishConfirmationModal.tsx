
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface PublishConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPublishing: boolean;
  editingClass?: boolean;
}

const PublishConfirmationModal = ({ 
  open, 
  onOpenChange, 
  onConfirm, 
  isPublishing,
  editingClass = false
}: PublishConfirmationModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <DialogTitle className="text-lg">
                {editingClass ? "Update and Publish Class?" : "Publish Class?"}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <DialogDescription className="space-y-3 text-sm text-gray-600">
          <p>
            {editingClass 
              ? "Are you sure you want to update and publish this class?" 
              : "Are you sure you want to publish this class?"
            }
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <p className="font-medium text-amber-800 mb-2">Important:</p>
            <ul className="list-disc list-inside space-y-1 text-amber-700 text-sm">
              <li>Once published, the class will be visible to all students</li>
              <li>Students will be able to enroll immediately</li>
              <li>You can still edit class details after publishing</li>
              <li>Make sure all information is correct before proceeding</li>
            </ul>
          </div>
        </DialogDescription>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPublishing}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPublishing}
            className="bg-[#1F4E79] hover:bg-[#1a4369]"
          >
            {isPublishing 
              ? "Publishing..." 
              : (editingClass ? "Update & Publish" : "Publish Now")
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishConfirmationModal;
