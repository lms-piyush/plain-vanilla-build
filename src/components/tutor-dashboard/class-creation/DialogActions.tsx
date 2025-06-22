
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  isPublishing: boolean;
  onSaveAsDraft: () => void;
  onPublish: () => void;
}

const DialogActions = ({ isPublishing, onSaveAsDraft, onPublish }: DialogActionsProps) => {
  return (
    <DialogFooter className="px-6 py-4 border-t">
      <Button 
        variant="outline" 
        onClick={onSaveAsDraft}
        disabled={isPublishing}
        className="bg-white hover:bg-gray-50"
      >
        Save as Draft
      </Button>
      <Button 
        onClick={onPublish}
        disabled={isPublishing}
        className="bg-[#1F4E79] hover:bg-[#1a4369]"
      >
        {isPublishing ? "Publishing..." : "Publish Now"}
      </Button>
    </DialogFooter>
  );
};

export default DialogActions;
