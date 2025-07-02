
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClassConfigFormProps {
  deliveryMode: 'online' | 'offline';
  setDeliveryMode: (value: 'online' | 'offline') => void;
  meetingLink: string;
  setMeetingLink: (value: string) => void;
  classFormat: 'live' | 'recorded' | 'inbound' | 'outbound';
  setClassFormat: (value: 'live' | 'recorded' | 'inbound' | 'outbound') => void;
  classSize: 'group' | 'one-on-one';
  setClassSize: (value: 'group' | 'one-on-one') => void;
  durationType: 'recurring' | 'fixed';
  setDurationType: (value: 'recurring' | 'fixed') => void;
}

const ClassConfigForm = ({
  deliveryMode,
  setDeliveryMode,
  meetingLink,
  setMeetingLink,
  classFormat,
  setClassFormat,
  classSize,
  setClassSize,
  durationType,
  setDurationType
}: ClassConfigFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Meeting Link field - only show when delivery mode is online */}
      {deliveryMode === 'online' && (
        <div>
          <Label htmlFor="meeting-link">Meeting Link</Label>
          <Input
            id="meeting-link"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="https://zoom.us/j/..."
            type="url"
          />
        </div>
      )}

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
        <Label htmlFor="duration-type">Payment Type</Label>
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
    </div>
  );
};

export default ClassConfigForm;
