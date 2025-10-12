import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TodayClass {
  id: string;
  name: string;
  type: 'Online' | 'Offline';
  status: 'Ongoing' | 'Completed' | 'Upcoming';
  format: 'Live' | 'Recorded' | 'Inbound' | 'Outbound';
  time: string;
  isStartable: boolean;
  class_id: string;
  tutor_name: string;
  session_date: string;
  start_time: string;
  end_time: string;
}

export const useStudentTodayClasses = () => {
  return useQuery({
    queryKey: ['student-today-classes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return [];
      }

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      console.log('Fetching today\'s classes for date:', today);

      // First get student enrollments
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('student_enrollments')
        .select(`
          id,
          class_id,
          classes!inner (
            id,
            title,
            delivery_mode,
            class_format,
            status,
            profiles!classes_tutor_id_fkey (
              full_name
            )
          )
        `)
        .eq('student_id', user.id)
        .eq('status', 'active')
        .eq('classes.status', 'active');

      if (enrollmentError) {
        console.error('Error fetching enrollments:', enrollmentError);
        throw enrollmentError;
      }

      console.log('Found enrollments:', enrollments?.length);

      if (!enrollments || enrollments.length === 0) {
        console.log('No active enrollments found');
        return [];
      }

      // Then get today's syllabus for these classes
      const classIds = enrollments.map(e => e.class_id);
      
      const { data: todaySyllabus, error: syllabusError } = await supabase
        .from('class_syllabus')
        .select('*')
        .in('class_id', classIds)
        .eq('session_date', today);

      if (syllabusError) {
        console.error('Error fetching today\'s syllabus:', syllabusError);
        throw syllabusError;
      }

      console.log('Found today\'s syllabus:', todaySyllabus?.length);

      // Transform the data
      const transformedClasses: TodayClass[] = [];

      if (todaySyllabus && todaySyllabus.length > 0) {
        for (const syllabus of todaySyllabus) {
          // Find the corresponding enrollment and class
          const enrollment = enrollments.find(e => e.class_id === syllabus.class_id);
          if (!enrollment) continue;

          const classData = enrollment.classes;
          
          const now = new Date();
          const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes since midnight
          
          // Parse session time
          const [startHour, startMinute] = syllabus.start_time?.split(':').map(Number) || [0, 0];
          const [endHour, endMinute] = syllabus.end_time?.split(':').map(Number) || [0, 0];
          const sessionStart = startHour * 60 + startMinute;
          const sessionEnd = endHour * 60 + endMinute;

          // Determine status and if startable
          let status: 'Ongoing' | 'Completed' | 'Upcoming' = 'Upcoming';
          let isStartable = false;

          if (currentTime >= sessionStart && currentTime <= sessionEnd) {
            status = 'Ongoing';
            isStartable = true;
          } else if (currentTime > sessionEnd) {
            status = 'Completed';
            isStartable = false;
          } else {
            status = 'Upcoming';
            isStartable = false;
          }

          // Format time display
          const formatTime = (time: string) => {
            const [hour, minute] = time.split(':');
            const hourNum = parseInt(hour);
            const period = hourNum >= 12 ? 'PM' : 'AM';
            const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
            return `${displayHour}:${minute} ${period}`;
          };

          const timeDisplay = syllabus.start_time && syllabus.end_time 
            ? `${formatTime(syllabus.start_time)} - ${formatTime(syllabus.end_time)}`
            : 'Time TBD';

          transformedClasses.push({
            id: syllabus.id,
            name: syllabus.title || (classData as any).title,
            type: (classData as any).delivery_mode === 'online' ? 'Online' : 'Offline',
            status,
            format: (classData as any).class_format === 'live' ? 'Live' : 
                    (classData as any).class_format === 'recorded' ? 'Recorded' :
                    (classData as any).class_format === 'inbound' ? 'Inbound' : 'Outbound',
            time: timeDisplay,
            isStartable,
            class_id: (classData as any).id,
            tutor_name: (classData as any).profiles?.full_name || 'Unknown Tutor',
            session_date: syllabus.session_date,
            start_time: syllabus.start_time || '',
            end_time: syllabus.end_time || '',
          });
        }
      }

      console.log('Transformed today\'s classes:', transformedClasses);
      return transformedClasses;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes to keep status current
  });
};