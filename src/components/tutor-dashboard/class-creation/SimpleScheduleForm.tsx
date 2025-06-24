
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

interface SimpleScheduleFormProps {
  startDate: string;
  setStartDate: (date: string) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
}

const SimpleScheduleForm = ({
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime
}: SimpleScheduleFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Schedule</h3>
      
      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date *</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={format(new Date(), 'yyyy-MM-dd')}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time *</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time *</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default SimpleScheduleForm;
