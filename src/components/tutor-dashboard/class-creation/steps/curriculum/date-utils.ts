// Days of week mapping for easier calculation
export const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// Get day name from date
export const getDayName = (date: Date): string => {
  return DAYS_OF_WEEK[date.getDay()];
};

// Check if date is valid and within bounds
export const isValidSessionDate = (date: Date, endDate: Date, enrollmentDeadline?: Date): boolean => {
  const now = new Date();
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  
  // Session must be after enrollment deadline (if set) and before end date
  if (enrollmentDeadline) {
    const enrollmentOnly = new Date(enrollmentDeadline.getFullYear(), enrollmentDeadline.getMonth(), enrollmentDeadline.getDate());
    if (dateOnly <= enrollmentOnly) return false;
  }
  
  return dateOnly <= endDateOnly;
};

// Helper to calculate next session date (legacy support)
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
      nextDate.setDate(nextDate.getDate() + 7);
  }
  
  return nextDate;
};