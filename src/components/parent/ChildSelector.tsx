import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useChildren } from "@/hooks/use-children";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ChildSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onAddChild?: () => void;
  label?: string;
  required?: boolean;
}

export const ChildSelector = ({ 
  value, 
  onChange, 
  onAddChild,
  label = "Select Child",
  required = false 
}: ChildSelectorProps) => {
  const { children } = useChildren();

  if (children.length === 0) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <p className="text-sm text-muted-foreground flex-1 py-2">
            No children added yet.
          </p>
          {onAddChild && (
            <Button type="button" variant="outline" onClick={onAddChild}>
              <Plus className="h-4 w-4 mr-2" />
              Add Child
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="child-selector">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange} required={required}>
          <SelectTrigger id="child-selector" className="flex-1">
            <SelectValue placeholder="Select a child" />
          </SelectTrigger>
          <SelectContent>
            {children.map((child) => (
              <SelectItem key={child.id} value={child.id}>
                {child.name}
                {child.age && ` (${child.age} years old)`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {onAddChild && (
          <Button type="button" variant="outline" size="icon" onClick={onAddChild}>
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
