import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useChildren } from "@/hooks/use-children";
import { AddChildDialog } from "./AddChildDialog";
import { AlertCircle, Users, Plus, Check } from "lucide-react";

interface EnhancedChildSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (childId: string) => void;
  onSelect?: (childId: string) => void;
  isProcessing?: boolean;
  classAgeMin?: number;
  classAgeMax?: number;
  classTitle?: string;
}

export const EnhancedChildSelector = ({ 
  open, 
  onOpenChange, 
  onConfirm,
  onSelect,
  isProcessing = false,
  classAgeMin,
  classAgeMax,
  classTitle
}: EnhancedChildSelectorProps) => {
  const [selectedChild, setSelectedChild] = useState("");
  const [showAddChild, setShowAddChild] = useState(false);
  const { children } = useChildren();

  const handleChildSelection = (childId: string) => {
    setSelectedChild(childId);
    if (onSelect) {
      onSelect(childId);
    }
  };

  const handleConfirm = () => {
    if (selectedChild) {
      onConfirm(selectedChild);
    }
  };

  const isChildEligible = (childAge: number | null) => {
    if (!childAge) return true; // If no age specified, allow
    if (!classAgeMin && !classAgeMax) return true; // If no class age restrictions, allow
    
    if (classAgeMin && childAge < classAgeMin) return false;
    if (classAgeMax && childAge > classAgeMax) return false;
    return true;
  };

  const getAgeRestrictionText = () => {
    if (classAgeMin && classAgeMax) {
      return `Ages ${classAgeMin}-${classAgeMax}`;
    } else if (classAgeMin) {
      return `Ages ${classAgeMin}+`;
    } else if (classAgeMax) {
      return `Up to age ${classAgeMax}`;
    }
    return "All ages";
  };

  const eligibleChildren = children.filter(child => isChildEligible(child.age));
  const ineligibleChildren = children.filter(child => !isChildEligible(child.age));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Child for Enrollment</DialogTitle>
            <DialogDescription>
              {classTitle && (
                <span className="block mb-2">Enrolling in: <strong>{classTitle}</strong></span>
              )}
              {(classAgeMin || classAgeMax) && (
                <Badge variant="outline" className="mb-2">
                  {getAgeRestrictionText()}
                </Badge>
              )}
              <span className="block">Which child would you like to enroll in this class?</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {children.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No children added yet</p>
                <Button onClick={() => setShowAddChild(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Child
                </Button>
              </div>
            ) : (
              <>
                {eligibleChildren.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Eligible Children</h4>
                    {eligibleChildren.map((child) => (
                      <div
                        key={child.id}
                        onClick={() => handleChildSelection(child.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedChild === child.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{child.name}</p>
                            <div className="flex gap-2 mt-1">
                              {child.age && (
                                <Badge variant="secondary" className="text-xs">
                                  Age: {child.age}
                                </Badge>
                              )}
                              {child.grade_level && (
                                <Badge variant="secondary" className="text-xs">
                                  {child.grade_level}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {selectedChild === child.id && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {ineligibleChildren.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Not Eligible for This Class
                    </h4>
                    {ineligibleChildren.map((child) => (
                      <div
                        key={child.id}
                        className="p-3 border border-dashed rounded-lg opacity-60 cursor-not-allowed"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{child.name}</p>
                            <div className="flex gap-2 mt-1">
                              {child.age && (
                                <Badge variant="outline" className="text-xs">
                                  Age: {child.age}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs text-destructive">
                                Age requirement not met
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {eligibleChildren.length === 0 && ineligibleChildren.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      None of your children meet the age requirements for this class. 
                      This class is for {getAgeRestrictionText().toLowerCase()}.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedChild || isProcessing || eligibleChildren.length === 0}
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