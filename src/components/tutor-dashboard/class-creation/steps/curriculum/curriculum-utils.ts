// Helper function to calculate next session date based on frequency
export const calculateNextSessionDate = (lastDate: Date, frequency: string): Date => {
  const nextDate = new Date(lastDate);
  
  switch (frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    default:
      nextDate.setDate(nextDate.getDate() + 7); // Default to weekly
  }
  
  return nextDate;
};

// Helper function to get default times from schedule step
export const getDefaultTimes = (timeSlots: any[]) => {
  if (timeSlots && timeSlots.length > 0) {
    return {
      startTime: timeSlots[0].startTime,
      endTime: timeSlots[0].endTime
    };
  }
  return {
    startTime: '',
    endTime: ''
  };
};