import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useChildren, Child } from "@/hooks/use-children";
import { AddChildDialog } from "@/components/parent/AddChildDialog";
import { ChildCard } from "@/components/parent/ChildCard";
import { useAuth } from "@/contexts/AuthContext";

const MyChildren = () => {
  const { user } = useAuth();
  const { children, isLoading, deleteChild } = useChildren();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);

  const handleEdit = (child: Child) => {
    setEditingChild(child);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingChild(null);
    }
  };

  if (user?.role !== "parent") {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">This page is only available for parent accounts.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Children</h1>
            <p className="text-muted-foreground mt-2">
              Manage your children's profiles and enrollments
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Child
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : children.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">You haven't added any children yet.</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Child
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                onEdit={handleEdit}
                onDelete={deleteChild}
              />
            ))}
          </div>
        )}

        <AddChildDialog
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          editChild={editingChild}
        />
      </div>
    </DashboardLayout>
  );
};

export default MyChildren;
