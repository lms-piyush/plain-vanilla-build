
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Clock, Calendar, BookOpen } from 'lucide-react';
import { useClassCreationStore } from '@/hooks/use-class-creation-store';

// Helper function to calculate next session date based on frequency
const calculateNextSessionDate = (lastDate: Date, frequency: string): Date => {
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
    editingClassId,
    startDate,
    frequency,
    timeSlots
  } = useClassCreationStore();
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);

  // Get default times from schedule step
  const getDefaultTimes = () => {
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

  // Auto-expand first lesson if curriculum is empty (new class)
  useEffect(() => {
    if (curriculum.length === 0) {
      const defaultTimes = getDefaultTimes();
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
    
    const defaultTimes = getDefaultTimes();
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

      <div className="space-y-4">
        {curriculum.map((lesson, index) => (
          <Card key={lesson.id || index} className="border-2">
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedLesson(expandedLesson === index ? null : index)}
            >
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>
                    {lesson.title || `Session ${lesson.weekNumber || index + 1}`}
                  </span>
                  {lesson.status && lesson.status !== 'upcoming' && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      lesson.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : lesson.status === 'running'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {lesson.status}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {lesson.sessionDate && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{lesson.sessionDate.toLocaleDateString()}</span>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveLesson(index);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>

            {expandedLesson === index && (
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`lesson-${index}-title`}>Session Title *</Label>
                  <Input
                    id={`lesson-${index}-title`}
                    value={lesson.title}
                    onChange={(e) => handleLessonUpdate(index, 'title', e.target.value)}
                    placeholder="Enter session title"
                  />
                </div>

                <div>
                  <Label htmlFor={`lesson-${index}-description`}>Session Description *</Label>
                  <Textarea
                    id={`lesson-${index}-description`}
                    value={lesson.description}
                    onChange={(e) => handleLessonUpdate(index, 'description', e.target.value)}
                    placeholder="Describe what students will learn in this session"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`lesson-${index}-date`}>Session Date</Label>
                    <Input
                      id={`lesson-${index}-date`}
                      type="date"
                      value={lesson.sessionDate ? lesson.sessionDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => handleLessonUpdate(index, 'sessionDate', e.target.value ? new Date(e.target.value) : undefined)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`lesson-${index}-start`}>Start Time</Label>
                    <Input
                      id={`lesson-${index}-start`}
                      type="time"
                      value={lesson.startTime}
                      onChange={(e) => handleLessonUpdate(index, 'startTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`lesson-${index}-end`}>End Time</Label>
                    <Input
                      id={`lesson-${index}-end`}
                      type="time"
                      value={lesson.endTime}
                      onChange={(e) => handleLessonUpdate(index, 'endTime', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Learning Objectives</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addObjective(index)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Objective
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(lesson.learningObjectives || []).map((objective, objIndex) => (
                      <div key={objIndex} className="flex items-center space-x-2">
                        <Input
                          value={objective}
                          onChange={(e) => handleObjectiveChange(index, objIndex, e.target.value)}
                          placeholder="Enter learning objective"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeObjective(index, objIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor={`lesson-${index}-notes`}>Additional Notes</Label>
                  <Textarea
                    id={`lesson-${index}-notes`}
                    value={lesson.notes}
                    onChange={(e) => handleLessonUpdate(index, 'notes', e.target.value)}
                    placeholder="Any additional notes for this session"
                    rows={2}
                  />
                </div>
              </CardContent>
            )}
          </Card>
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
