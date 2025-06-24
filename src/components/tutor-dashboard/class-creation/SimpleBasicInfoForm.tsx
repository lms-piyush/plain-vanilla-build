
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SimpleBasicInfoFormProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  subject: string;
  setSubject: (subject: string) => void;
  status: 'draft' | 'active' | 'inactive' | 'completed';
  setStatus: (status: 'draft' | 'active' | 'inactive' | 'completed') => void;
  price: string;
  setPrice: (price: string) => void;
  maxStudents: string;
  setMaxStudents: (maxStudents: string) => void;
  classSize: 'group' | 'one-on-one';
}

const SimpleBasicInfoForm = ({
  title,
  setTitle,
  description,
  setDescription,
  subject,
  setSubject,
  status,
  setStatus,
  price,
  setPrice,
  maxStudents,
  setMaxStudents,
  classSize
}: SimpleBasicInfoFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Information</h3>
      
      <div className="space-y-2">
        <Label htmlFor="title">Class Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter class title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your class"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Mathematics, Science"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
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

        <div className="space-y-2">
          <Label htmlFor="maxStudents">Max Students</Label>
          <Input
            id="maxStudents"
            type="number"
            value={maxStudents}
            onChange={(e) => setMaxStudents(e.target.value)}
            placeholder="10"
            min="1"
            disabled={classSize === 'one-on-one'}
          />
        </div>
      </div>
    </div>
  );
};

export default SimpleBasicInfoForm;
