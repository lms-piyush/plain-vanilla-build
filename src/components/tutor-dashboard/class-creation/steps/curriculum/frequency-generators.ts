import { SessionGenerationParams, GeneratedSession } from './types';
import { getDayName, isValidSessionDate } from './date-utils';

// Generate sessions for daily frequency
export const generateDailySessions = (params: SessionGenerationParams): GeneratedSession[] => {
  const { startDate, endDate, enrollmentDeadline, timeSlots } = params;
  const sessions: GeneratedSession[] = [];
  
  const currentDate = new Date(startDate);
  
  while (isValidSessionDate(currentDate, endDate, enrollmentDeadline)) {
    const dayName = getDayName(currentDate);
    
    // For daily frequency, generate sessions using all time slots for each day
    timeSlots.forEach(slot => {
      sessions.push({
        sessionDate: new Date(currentDate),
        startTime: slot.startTime,
        endTime: slot.endTime,
        dayOfWeek: dayName
      });
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return sessions;
};

// Generate sessions for weekly frequency
export const generateWeeklySessions = (params: SessionGenerationParams): GeneratedSession[] => {
  const { startDate, endDate, enrollmentDeadline, timeSlots } = params;
  const sessions: GeneratedSession[] = [];
  
  // Get unique days from time slots
  const scheduledDays = [...new Set(timeSlots.map(slot => slot.dayOfWeek))];
  
  let currentDate = new Date(startDate);
  
  while (isValidSessionDate(currentDate, endDate, enrollmentDeadline)) {
    // For each week, generate sessions for scheduled days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const sessionDate = new Date(currentDate);
      sessionDate.setDate(sessionDate.getDate() + dayOffset);
      
      if (!isValidSessionDate(sessionDate, endDate, enrollmentDeadline)) {
        continue;
      }
      
      const dayName = getDayName(sessionDate);
      
      // Generate sessions for time slots that match this day
      timeSlots
        .filter(slot => slot.dayOfWeek === dayName)
        .forEach(slot => {
          sessions.push({
            sessionDate: new Date(sessionDate),
            startTime: slot.startTime,
            endTime: slot.endTime,
            dayOfWeek: dayName
          });
        });
    }
    
    // Move to next week
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  return sessions;
};

// Generate sessions for monthly frequency
export const generateMonthlySessions = (params: SessionGenerationParams): GeneratedSession[] => {
  const { startDate, endDate, enrollmentDeadline, timeSlots } = params;
  const sessions: GeneratedSession[] = [];
  
  let currentDate = new Date(startDate);
  
  while (isValidSessionDate(currentDate, endDate, enrollmentDeadline)) {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Generate sessions for each day in the month that matches time slots
    for (let day = 1; day <= monthEnd.getDate(); day++) {
      const sessionDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      
      if (!isValidSessionDate(sessionDate, endDate, enrollmentDeadline)) {
        continue;
      }
      
      const dayName = getDayName(sessionDate);
      
      // Generate sessions for time slots that match this day
      timeSlots
        .filter(slot => slot.dayOfWeek === dayName)
        .forEach(slot => {
          sessions.push({
            sessionDate: new Date(sessionDate),
            startTime: slot.startTime,
            endTime: slot.endTime,
            dayOfWeek: dayName
          });
        });
    }
    
    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return sessions;
};