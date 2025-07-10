import { SessionGenerationParams, LessonItem, TimeSlot } from './types';
import { generateDailySessions, generateWeeklySessions, generateMonthlySessions } from './frequency-generators';

// Main function to generate all sessions
export const generateAllSessions = (params: SessionGenerationParams): LessonItem[] => {
  if (!params.frequency || !params.startDate || !params.endDate || !params.timeSlots.length) {
    return [];
  }
  
  let generatedSessions;
  
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