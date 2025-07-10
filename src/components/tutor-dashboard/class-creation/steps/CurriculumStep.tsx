
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useClassCreationStore } from '@/hooks/use-class-creation-store';
import { 
  calculateNextSessionDate, 
  getDefaultTimes, 
  generateAllSessions, 
  generateAdditionalSessions 
} from './curriculum/enhanced-session-generator';
import LessonCard from './curriculum/LessonCard';
import AutoGenerationControls from './curriculum/AutoGenerationControls';

interface CurriculumStepProps {
  onNext: () => void;
  onBack: () => void;
}

const CurriculumStep = ({ onNext, onBack }: CurriculumStepProps) => {
  const { 
    curriculum, 
    addLesson, 
    updateLesson, 
    removeLesson, 
    setCurriculum,
    editingClassId,
    startDate,
    endDate,
    enrollmentDeadline,
    frequency,
    timeSlots
  } = useClassCreationStore();
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);

  // Auto-expand first lesson if curriculum is empty (new class)
  useEffect(() => {
    if (curriculum.length === 0) {
      const defaultTimes = getDefaultTimes(timeSlots);
      // Add initial lesson for new classes with auto-filled data
      addLesson({
        title: '',
        description: '',
        weekNumber: 1,
        learningObjectives: [],
        sessionDate: startDate || undefined,
        startTime: defaultTimes.startTime,
        endTime: defaultTimes.endTime,
        status: 'upcoming',
        notes: '',
      });
      setExpandedLesson(0);
    } else if (editingClassId && expandedLesson === null) {
      // When editing, don't auto-expand any lesson
      setExpandedLesson(null);
    }
  }, [curriculum.length, addLesson, editingClassId, expandedLesson, startDate, timeSlots]);

  const handleAddLesson = () => {
    const newWeekNumber = curriculum.length > 0 
      ? Math.max(...curriculum.map(l => l.weekNumber || 1)) + 1 
      : 1;
    
    const defaultTimes = getDefaultTimes(timeSlots);
    let nextSessionDate: Date | undefined;
    
    // Calculate next session date based on frequency and last session
    if (curriculum.length > 0 && frequency) {
      const lastLesson = curriculum[curriculum.length - 1];
      if (lastLesson.sessionDate) {
        nextSessionDate = calculateNextSessionDate(lastLesson.sessionDate, frequency);
      } else if (startDate) {
        // If last lesson doesn't have a date but we have a start date, calculate from there
        const sessionIndex = curriculum.length;
        nextSessionDate = new Date(startDate);
        for (let i = 0; i < sessionIndex; i++) {
          nextSessionDate = calculateNextSessionDate(nextSessionDate, frequency);
        }
      }
    } else if (startDate && curriculum.length === 0) {
      // First session uses the start date
      nextSessionDate = startDate;
    }
    
    addLesson({
      title: '',
      description: '',
      weekNumber: newWeekNumber,
      learningObjectives: [],
      sessionDate: nextSessionDate,
      startTime: defaultTimes.startTime,
      endTime: defaultTimes.endTime,
      status: 'upcoming',
      notes: '',
    });
    
    setExpandedLesson(curriculum.length);
  };

  const handleRemoveLesson = (index: number) => {
    removeLesson(index);
    if (expandedLesson === index) {
      setExpandedLesson(null);
    } else if (expandedLesson !== null && expandedLesson > index) {
      setExpandedLesson(expandedLesson - 1);
    }
  };

  const handleLessonUpdate = (index: number, field: string, value: any) => {
    updateLesson(index, { [field]: value });
  };

  const handleObjectiveChange = (lessonIndex: number, objectiveIndex: number, value: string) => {
    const lesson = curriculum[lessonIndex];
    const newObjectives = [...(lesson.learningObjectives || [])];
    newObjectives[objectiveIndex] = value;
    updateLesson(lessonIndex, { learningObjectives: newObjectives });
  };

  const addObjective = (lessonIndex: number) => {
    const lesson = curriculum[lessonIndex];
    const newObjectives = [...(lesson.learningObjectives || []), ''];
    updateLesson(lessonIndex, { learningObjectives: newObjectives });
  };

  const removeObjective = (lessonIndex: number, objectiveIndex: number) => {
    const lesson = curriculum[lessonIndex];
    const newObjectives = (lesson.learningObjectives || []).filter((_, i) => i !== objectiveIndex);
    updateLesson(lessonIndex, { learningObjectives: newObjectives });
  };

  // Auto-generate all sessions based on frequency and schedule
  const handleAutoGenerate = () => {
    if (!frequency || !startDate || !endDate || !timeSlots.length) {
      console.warn('Missing required data for session generation');
      return;
    }

    const generatedSessions = generateAllSessions({
      frequency,
      startDate,
      endDate,
      enrollmentDeadline: enrollmentDeadline || undefined,
      timeSlots
    });

    setCurriculum(generatedSessions);
    setExpandedLesson(0);
  };

  // Generate additional sessions from existing curriculum
  const handleExtendSessions = () => {
    if (!frequency || !startDate || !endDate || !timeSlots.length) {
      console.warn('Missing required data for session extension');
      return;
    }

    const additionalSessions = generateAdditionalSessions(curriculum, {
      frequency,
      startDate,
      endDate,
      enrollmentDeadline: enrollmentDeadline || undefined,
      timeSlots
    });

    setCurriculum([...curriculum, ...additionalSessions]);
  };

  // Clear all sessions
  const handleClearAll = () => {
    setCurriculum([]);
    setExpandedLesson(null);
  };

  const canGenerateFromSchedule = frequency && startDate && endDate && timeSlots.length > 0;
  const canProceed = curriculum.length > 0 && curriculum.every(lesson => 
    lesson.title.trim() !== '' && lesson.description.trim() !== ''
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Course Curriculum</h3>
        <p className="text-gray-600">
          {editingClassId 
            ? "Review and update your class curriculum and sessions"
            : "Plan your lessons and create a structured learning path"
          }
        </p>
      </div>

      {/* Auto-generation Controls */}
      <AutoGenerationControls
        canGenerate={canGenerateFromSchedule}
        hasSessions={curriculum.length > 0}
        frequency={frequency || undefined}
        startDate={startDate || undefined}
        endDate={endDate || undefined}
        onAutoGenerate={handleAutoGenerate}
        onExtendSessions={handleExtendSessions}
        onClearAll={handleClearAll}
      />

      <div className="space-y-4">
        {curriculum.map((lesson, index) => (
          <LessonCard
            key={lesson.id || index}
            lesson={lesson}
            index={index}
            isExpanded={expandedLesson === index}
            onToggleExpanded={() => setExpandedLesson(expandedLesson === index ? null : index)}
            onRemoveLesson={handleRemoveLesson}
            onLessonUpdate={handleLessonUpdate}
            onObjectiveChange={handleObjectiveChange}
            onAddObjective={addObjective}
            onRemoveObjective={removeObjective}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={handleAddLesson}
          className="w-full border-dashed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Session
        </Button>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          className="bg-primary hover:bg-primary/90"
        >
          Next: Preview
        </Button>
      </div>
    </div>
  );
};

export default CurriculumStep;