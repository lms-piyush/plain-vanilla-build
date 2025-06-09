
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicInfoFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  subject: string;
  setSubject: (value: string) => void;
  status: 'draft' | 'active' | 'inactive' | 'completed';
  setStatus: (value: 'draft' | 'active' | 'inactive' | 'completed') => void;
  price: string;
  setPrice: (value: string) => void;
  maxStudents: string;
  setMaxStudents: (value: string) => void;
  classSize: 'group' | 'one-on-one';
}

const BasicInfoForm = ({
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
}: BasicInfoFormProps) => {
  return (
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
        <Label htmlFor="class-status">Class Status</Label>
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
          disabled={classSize === 'one-on-one'}
          className={classSize === 'one-on-one' ? 'bg-gray-100 cursor-not-allowed' : ''}
        />
        {classSize === 'one-on-one' && (
          <p className="text-sm text-gray-500 mt-1">
            Max students is automatically set to 1 for one-on-one classes
          </p>
        )}
      </div>
    </div>
  );
};

export default BasicInfoForm;
