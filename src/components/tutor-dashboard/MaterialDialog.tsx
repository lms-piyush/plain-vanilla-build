
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material?: any;
  classId: string;
  sessions: any[];
  onSuccess: () => void;
}

const MaterialDialog = ({ open, onOpenChange, material, classId, sessions, onSuccess }: MaterialDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    material_name: '',
    material_type: 'document',
    material_url: '',
    lesson_id: '',
  });

  useEffect(() => {
    if (material) {
      setFormData({
        material_name: material.material_name || '',
        material_type: material.material_type || 'document',
        material_url: material.material_url || '',
        lesson_id: material.lesson_id || '',
      });
    } else {
      setFormData({
        material_name: '',
        material_type: 'document',
        material_url: '',
        lesson_id: '',
      });
    }
  }, [material]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (material) {
        const { error } = await supabase
          .from('lesson_materials')
          .update({
            material_name: formData.material_name,
            material_type: formData.material_type,
            material_url: formData.material_url,
          })
          .eq('id', material.id);

        if (error) throw error;
        
        toast({
          title: "Material updated successfully",
          description: "The material has been updated.",
        });
      } else {
        const { error } = await supabase
          .from('lesson_materials')
          .insert({
            material_name: formData.material_name,
            material_type: formData.material_type,
            material_url: formData.material_url,
            lesson_id: formData.lesson_id,
            display_order: 0,
          });

        if (error) throw error;
        
        toast({
          title: "Material uploaded successfully",
          description: "The material has been added to the session.",
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving material:', error);
      toast({
        title: "Error saving material",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{material ? 'Edit Material' : 'Upload New Material'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="material_name">Material Name</Label>
            <Input
              id="material_name"
              value={formData.material_name}
              onChange={(e) => setFormData({ ...formData, material_name: e.target.value })}
              placeholder="Enter material name"
              required
            />
          </div>

          <div>
            <Label htmlFor="material_type">Material Type</Label>
            <Select 
              value={formData.material_type} 
              onValueChange={(value) => setFormData({ ...formData, material_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select material type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="presentation">Presentation</SelectItem>
                <SelectItem value="worksheet">Worksheet</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="material_url">Material URL</Label>
            <Input
              id="material_url"
              value={formData.material_url}
              onChange={(e) => setFormData({ ...formData, material_url: e.target.value })}
              placeholder="Enter material URL"
              required
            />
          </div>

          {!material && (
            <div>
              <Label htmlFor="lesson_id">Session</Label>
              <Select 
                value={formData.lesson_id} 
                onValueChange={(value) => setFormData({ ...formData, lesson_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      Week {session.week_number}: {session.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : material ? 'Update Material' : 'Upload Material'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialDialog;
