import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CardContent } from '@/components/ui/card';
import { LessonItem } from '@/hooks/use-class-creation-store';
import LearningObjectives from './LearningObjectives';

interface LessonFormProps {
  lesson: LessonItem;
  index: number;
  onLessonUpdate: (index: number, field: string, value: any) => void;
  onObjectiveChange: (lessonIndex: number, objectiveIndex: number, value: string) => void;
  onAddObjective: (lessonIndex: number) => void;
  onRemoveObjective: (lessonIndex: number, objectiveIndex: number) => void;
}

const LessonForm = ({
  lesson,
  index,
  onLessonUpdate,
  onObjectiveChange,
  onAddObjective,
  onRemoveObjective
}: LessonFormProps) => {
  return (
    <CardContent className="space-y-4">
      <div>
        <Label htmlFor={`lesson-${index}-title`}>Session Title *</Label>
        <Input
          id={`lesson-${index}-title`}
          value={lesson.title}
          onChange={(e) => onLessonUpdate(index, 'title', e.target.value)}
          placeholder="Enter session title"
        />
      </div>

      <div>
        <Label htmlFor={`lesson-${index}-description`}>Session Description *</Label>
        <Textarea
          id={`lesson-${index}-description`}
          value={lesson.description}
          onChange={(e) => onLessonUpdate(index, 'description', e.target.value)}
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
            onChange={(e) => onLessonUpdate(index, 'sessionDate', e.target.value ? new Date(e.target.value) : undefined)}
          />
        </div>
        <div>
          <Label htmlFor={`lesson-${index}-start`}>Start Time</Label>
          <Input
            id={`lesson-${index}-start`}
            type="time"
            value={lesson.startTime}
            onChange={(e) => onLessonUpdate(index, 'startTime', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor={`lesson-${index}-end`}>End Time</Label>
          <Input
            id={`lesson-${index}-end`}
            type="time"
            value={lesson.endTime}
            onChange={(e) => onLessonUpdate(index, 'endTime', e.target.value)}
          />
        </div>
      </div>

      <LearningObjectives
        objectives={lesson.learningObjectives || []}
        onObjectiveChange={(objIndex, value) => onObjectiveChange(index, objIndex, value)}
        onAddObjective={() => onAddObjective(index)}
        onRemoveObjective={(objIndex) => onRemoveObjective(index, objIndex)}
      />

      <div>
        <Label htmlFor={`lesson-${index}-notes`}>Additional Notes</Label>
        <Textarea
          id={`lesson-${index}-notes`}
          value={lesson.notes}
          onChange={(e) => onLessonUpdate(index, 'notes', e.target.value)}
          placeholder="Any additional notes for this session"
          rows={2}
        />
      </div>
    </CardContent>
  );
};

export default LessonForm;