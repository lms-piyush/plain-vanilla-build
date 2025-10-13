import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChildren, Child } from "@/hooks/use-children";

interface AddChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editChild?: Child | null;
}

export const AddChildDialog = ({ open, onOpenChange, editChild }: AddChildDialogProps) => {
  const { addChild, updateChild } = useChildren();
  const [formData, setFormData] = useState({
    name: editChild?.name || "",
    age: editChild?.age?.toString() || "",
    grade_level: editChild?.grade_level || "",
    date_of_birth: editChild?.date_of_birth || "",
    interests: editChild?.interests?.join(", ") || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const childData = {
      name: formData.name,
      age: formData.age ? parseInt(formData.age) : null,
      grade_level: formData.grade_level || null,
      date_of_birth: formData.date_of_birth || null,
      interests: formData.interests ? formData.interests.split(",").map(i => i.trim()) : null,
    };

    if (editChild) {
      updateChild({ id: editChild.id, ...childData });
    } else {
      addChild(childData);
    }
    
    onOpenChange(false);
    setFormData({ name: "", age: "", grade_level: "", date_of_birth: "", interests: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editChild ? "Edit Child" : "Add New Child"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="grade_level">Grade Level</Label>
              <Input
                id="grade_level"
                value={formData.grade_level}
                onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
                placeholder="e.g., 5th Grade"
              />
            </div>
            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="interests">Interests (comma-separated)</Label>
              <Input
                id="interests"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                placeholder="e.g., Math, Science, Art"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editChild ? "Update" : "Add Child"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
