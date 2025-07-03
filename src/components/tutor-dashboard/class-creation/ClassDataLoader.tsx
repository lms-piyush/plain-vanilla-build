
import { useEffect } from 'react';
import { useClassCreationStore } from '@/hooks/use-class-creation-store';

interface ClassDataLoaderProps {
  classId?: string;
  children: React.ReactNode;
}

const ClassDataLoader = ({ classId, children }: ClassDataLoaderProps) => {
  const { loadExistingClassData, reset, editingClassId } = useClassCreationStore();

  useEffect(() => {
    const loadData = async () => {
      if (classId && classId !== editingClassId) {
        console.log('Loading class data for editing:', classId);
        try {
          await loadExistingClassData(classId);
          console.log('Class data loaded successfully');
        } catch (error) {
          console.error('Failed to load class data:', error);
          // Don't reset on error, let user see the error and retry
        }
      } else if (!classId && editingClassId) {
        // Clear data when switching from edit to create mode
        console.log('Resetting class creation store');
        reset();
      }
    };

    loadData();
  }, [classId, loadExistingClassData, reset, editingClassId]);

  return <>{children}</>;
};

export default ClassDataLoader;
