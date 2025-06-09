
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

interface ScheduleFormProps {
  startDate: string;
  setStartDate: (value: string) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
}

const ScheduleForm = ({
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime
}: ScheduleFormProps) => {
  // Get display day from selected date
  const getDisplayDay = () => {
    if (!startDate) return '';
    const date = new Date(startDate);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <>
      {/* Schedule Section */}
      <div className="md:col-span-2">
        <h3 className="text-lg font-medium mb-4 border-t pt-4">Schedule Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start-date">Start Date *</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={format(new Date(), 'yyyy-MM-dd')}
            required
          />
        </div>

        {/* Display the auto-populated day of week */}
        {startDate && (
          <div>
            <Label>Day of Week (Auto-populated)</Label>
            <Input
              value={getDisplayDay()}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
            <p className="text-sm text-gray-500 mt-1">
              Day is automatically determined from the selected date
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="start-time">Start Time *</Label>
          <Input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="end-time">End Time *</Label>
          <Input
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>
    </>
  );
};

export default ScheduleForm;
