import { TimeSlot, Frequency, LessonItem } from '@/hooks/use-class-creation-store/types';

interface SessionGenerationParams {
  frequency: Frequency;
  startDate: Date;
  endDate: Date;
  enrollmentDeadline?: Date;
  timeSlots: TimeSlot[];
}

interface GeneratedSession {
  sessionDate: Date;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
}

// Days of week mapping for easier calculation
const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// Get day name from date
const getDayName = (date: Date): string => {
  return DAYS_OF_WEEK[date.getDay()];
};

// Check if date is valid and within bounds
const isValidSessionDate = (date: Date, endDate: Date, enrollmentDeadline?: Date): boolean => {
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

// Generate sessions for daily frequency
const generateDailySessions = (params: SessionGenerationParams): GeneratedSession[] => {
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
const generateWeeklySessions = (params: SessionGenerationParams): GeneratedSession[] => {
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
const generateMonthlySessions = (params: SessionGenerationParams): GeneratedSession[] => {
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

// Main function to generate all sessions
export const generateAllSessions = (params: SessionGenerationParams): LessonItem[] => {
  if (!params.frequency || !params.startDate || !params.endDate || !params.timeSlots.length) {
    return [];
  }
  
  let generatedSessions: GeneratedSession[] = [];
  
  switch (params.frequency) {
    case 'daily':
      generatedSessions = generateDailySessions(params);
      break;
    case 'weekly':
      generatedSessions = generateWeeklySessions(params);
      break;
    case 'monthly':
      generatedSessions = generateMonthlySessions(params);
      break;
    default:
      return [];
  }
  
  // Convert generated sessions to LessonItem format
  return generatedSessions.map((session, index) => ({
    title: `Session ${index + 1}`,
    description: '',
    weekNumber: Math.floor(index / params.timeSlots.length) + 1,
    learningObjectives: [],
    sessionDate: session.sessionDate,
    startTime: session.startTime,
    endTime: session.endTime,
    status: 'upcoming',
    notes: ''
  }));
};

// Function to extend sessions from existing curriculum
export const generateAdditionalSessions = (
  existingCurriculum: LessonItem[],
  params: SessionGenerationParams
): LessonItem[] => {
  // Get the last session date from existing curriculum
  const lastSession = existingCurriculum
    .filter(lesson => lesson.sessionDate)
    .sort((a, b) => (b.sessionDate!.getTime() - a.sessionDate!.getTime()))[0];
  
  if (!lastSession || !lastSession.sessionDate) {
    return generateAllSessions(params);
  }
  
  // Start generating from the day after the last session
  const nextStartDate = new Date(lastSession.sessionDate);
  nextStartDate.setDate(nextStartDate.getDate() + 1);
  
  const extendedParams = {
    ...params,
    startDate: nextStartDate
  };
  
  const newSessions = generateAllSessions(extendedParams);
  
  // Adjust session numbers to continue from existing curriculum
  return newSessions.map((session, index) => ({
    ...session,
    title: `Session ${existingCurriculum.length + index + 1}`,
    weekNumber: Math.floor((existingCurriculum.length + index) / params.timeSlots.length) + 1
  }));
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

// Helper to get default times from schedule step
export const getDefaultTimes = (timeSlots: TimeSlot[]) => {
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