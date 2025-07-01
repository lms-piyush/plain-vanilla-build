
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SimpleClassConfigFormProps {
  deliveryMode: 'online' | 'offline';
  setDeliveryMode: (mode: 'online' | 'offline') => void;
  meetingLink: string;
  setMeetingLink: (link: string) => void;
  classFormat: 'live' | 'recorded' | 'inbound' | 'outbound';
  setClassFormat: (format: 'live' | 'recorded' | 'inbound' | 'outbound') => void;
  classSize: 'group' | 'one-on-one';
  setClassSize: (size: 'group' | 'one-on-one') => void;
  durationType: 'recurring' | 'fixed';
  setDurationType: (type: 'recurring' | 'fixed') => void;
}

const SimpleClassConfigForm = ({
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
}: SimpleClassConfigFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Class Configuration</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="deliveryMode">Delivery Mode</Label>
          <Select value={deliveryMode} onValueChange={setDeliveryMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="classFormat">Class Format</Label>
          <Select value={classFormat} onValueChange={setClassFormat}>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="classSize">Class Size</Label>
          <Select value={classSize} onValueChange={setClassSize}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="group">Group</SelectItem>
              <SelectItem value="one-on-one">One-on-One</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="durationType">Payment Type</Label>
          <Select value={durationType} onValueChange={setDurationType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed</SelectItem>
              <SelectItem value="recurring">Recurring</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {deliveryMode === 'online' && (
        <div className="space-y-2">
          <Label htmlFor="meetingLink">Meeting Link</Label>
          <Input
            id="meetingLink"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="https://zoom.us/j/..."
            type="url"
          />
        </div>
      )}
    </div>
  );
};

export default SimpleClassConfigForm;
