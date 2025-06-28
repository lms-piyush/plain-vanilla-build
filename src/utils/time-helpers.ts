
export const formatTime = (time: string): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const parseTime = (time: string): string => {
  if (!time) return '';
  // If it's already in 24-hour format, return as is
  if (time.includes(':') && !time.includes('AM') && !time.includes('PM')) {
    return time;
  }
  // Handle AM/PM format
  const [timePart, ampm] = time.split(' ');
  const [hours, minutes] = timePart.split(':');
  let hour = parseInt(hours, 10);
  
  if (ampm === 'PM' && hour !== 12) {
    hour += 12;
  } else if (ampm === 'AM' && hour === 12) {
    hour = 0;
  }
  
  return `${hour.toString().padStart(2, '0')}:${minutes}`;
};
