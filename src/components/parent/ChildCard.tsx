import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, User } from "lucide-react";
import { Child } from "@/hooks/use-children";

interface ChildCardProps {
  child: Child;
  onEdit: (child: Child) => void;
  onDelete: (childId: string) => void;
}

export const ChildCard = ({ child, onEdit, onDelete }: ChildCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5" />
          {child.name}
        </CardTitle>
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" onClick={() => onEdit(child)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onDelete(child.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {child.age && (
            <p className="text-sm text-muted-foreground">
              Age: <span className="font-medium">{child.age}</span>
            </p>
          )}
          {child.grade_level && (
            <p className="text-sm text-muted-foreground">
              Grade: <span className="font-medium">{child.grade_level}</span>
            </p>
          )}
          {child.interests && child.interests.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {child.interests.map((interest, idx) => (
                <Badge key={idx} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
