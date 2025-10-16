import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChildSession {
  id: string;
  childId: string;
  childName: string;
  className: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  status: string;
  classId: string;
  color: string;
}

export const useFamilyCalendar = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChildSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Color palette for different children
  const childColors = [
    '#8A5BB7', // Primary purple
    '#BA8DF1', // Light purple
    '#10b981', // Green
    '#3b82f6', // Blue
    '#f59e0b', // Orange
    '#ec4899', // Pink
  ];

  useEffect(() => {
    if (!user?.id || user.role !== 'parent') {
      setIsLoading(false);
      return;
    }

    const fetchFamilySessions = async () => {
      try {
        // Fetch all children
        const { data: children, error: childrenError } = await supabase
          .from('children')
          .select('id, name')
          .eq('parent_id', user.id);

        if (childrenError) throw childrenError;

        if (!children || children.length === 0) {
          setSessions([]);
          setIsLoading(false);
          return;
        }

        // Assign colors to children
        const childColorMap: { [key: string]: string } = {};
        children.forEach((child, index) => {
          childColorMap[child.id] = childColors[index % childColors.length];
        });

        // Fetch all enrollments for all children
        const childIds = children.map(c => c.id);
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('student_enrollments')
          .select(`
            id,
            child_id,
            class_id,
            status,
            classes!inner(
              id,
              title,
              class_syllabus(
                id,
                session_date,
                start_time,
                end_time,
                status
              )
            )
          `)
          .in('child_id', childIds)
          .eq('enrolled_by_parent_id', user.id)
          .in('status', ['active', 'pending']);

        if (enrollmentsError) throw enrollmentsError;

        // Transform data into sessions
        const allSessions: ChildSession[] = [];
        enrollments?.forEach((enrollment: any) => {
          const child = children.find(c => c.id === enrollment.child_id);
          if (!child) return;

          const syllabus = enrollment.classes?.class_syllabus || [];
          syllabus.forEach((session: any) => {
            if (session.session_date) {
              allSessions.push({
                id: session.id,
                childId: child.id,
                childName: child.name,
                className: enrollment.classes.title,
                sessionDate: session.session_date,
                startTime: session.start_time || '09:00',
                endTime: session.end_time || '10:00',
                status: session.status || 'scheduled',
                classId: enrollment.class_id,
                color: childColorMap[child.id],
              });
            }
          });
        });

        // Sort sessions by date
        allSessions.sort((a, b) => 
          new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime()
        );

        setSessions(allSessions);
      } catch (error) {
        console.error('Error fetching family sessions:', error);
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFamilySessions();
  }, [user?.id, user?.role]);

  return {
    sessions,
    isLoading,
  };
};
