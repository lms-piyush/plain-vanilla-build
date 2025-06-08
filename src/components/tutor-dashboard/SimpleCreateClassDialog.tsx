
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { TutorClass } from '@/hooks/use-tutor-classes';

interface SimpleCreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClassCreated: () => void;
  editingClass?: TutorClass | null;
}

const SimpleCreateClassDialog = ({ 
  open, 
  onOpenChange, 
  onClassCreated, 
  editingClass 
}: SimpleCreateClassDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<'online' | 'offline'>('online');
  const [classFormat, setClassFormat] = useState<'live' | 'recorded' | 'inbound' | 'outbound'>('live');
  const [classSize, setClassSize] = useState<'group' | 'one-on-one'>('group');
  const [durationType, setDurationType] = useState<'recurring' | 'fixed'>('fixed');
  const [status, setStatus] = useState<'draft' | 'active' | 'inactive' | 'completed'>('draft');
  const [price, setPrice] = useState('');
  const [maxStudents, setMaxStudents] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes or when editing class changes
  useEffect(() => {
    if (editingClass) {
      setTitle(editingClass.title || '');
      setDescription(editingClass.description || '');
      setSubject(editingClass.subject || '');
      setDeliveryMode(editingClass.delivery_mode);
      setClassFormat(editingClass.class_format);
      setClassSize(editingClass.class_size);
      setDurationType(editingClass.duration_type);
      setStatus(editingClass.status);
      setPrice(editingClass.price?.toString() || '');
      setMaxStudents(editingClass.max_students?.toString() || '');
    } else {
      // Reset form for new class
      setTitle('');
      setDescription('');
      setSubject('');
      setDeliveryMode('online');
      setClassFormat('live');
      setClassSize('group');
      setDurationType('fixed');
      setStatus('draft');
      setPrice('');
      setMaxStudents('');
    }
  }, [editingClass, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a class title');
      return;
    }

    setIsSubmitting(true);

    try {
      const classData = {
        title: title.trim(),
        description: description.trim() || null,
        subject: subject.trim() || null,
        delivery_mode: deliveryMode,
        class_format: classFormat,
        class_size: classSize,
        duration_type: durationType,
        status: status,
        price: price ? parseFloat(price) : null,
        max_students: maxStudents ? parseInt(maxStudents) : null,
        currency: 'USD'
      };

      if (editingClass) {
        // Update existing class
        const { error } = await supabase
          .from('classes')
          .update({
            ...classData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingClass.id);

        if (error) throw error;
        toast.success('Class updated successfully!');
      } else {
        // Create new class
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error('You must be logged in to create a class');
          return;
        }

        const { error } = await supabase
          .from('classes')
          .insert({
            ...classData,
            tutor_id: user.id
          });

        if (error) throw error;
        toast.success('Class created successfully!');
      }

      onClassCreated();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving class:', error);
      toast.error(`Failed to ${editingClass ? 'update' : 'create'} class: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingClass ? 'Edit Class' : 'Create New Class'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Class Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter class title"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter class description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Mathematics, Science"
              />
            </div>

            <div>
              <Label htmlFor="delivery-mode">Delivery Mode</Label>
              <Select value={deliveryMode} onValueChange={(value: 'online' | 'offline') => setDeliveryMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="class-format">Class Format</Label>
              <Select value={classFormat} onValueChange={(value: 'live' | 'recorded' | 'inbound' | 'outbound') => setClassFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="recorded">Recorded</SelectItem>
                  <SelectItem value="inbound">Inbound</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="class-size">Class Size</Label>
              <Select value={classSize} onValueChange={(value: 'group' | 'one-on-one') => setClassSize(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group">Group</SelectItem>
                  <SelectItem value="one-on-one">One-on-One</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration-type">Duration Type</Label>
              <Select value={durationType} onValueChange={(value: 'recurring' | 'fixed') => setDurationType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recurring">Recurring</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Class Status</Label>
              <Select value={status} onValueChange={(value: 'draft' | 'active' | 'inactive' | 'completed') => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="max-students">Max Students</Label>
              <Input
                id="max-students"
                type="number"
                value={maxStudents}
                onChange={(e) => setMaxStudents(e.target.value)}
                placeholder="Enter maximum students"
                min="1"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (editingClass ? 'Updating...' : 'Creating...') 
                : (editingClass ? 'Update Class' : 'Create Class')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleCreateClassDialog;
