import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Calendar, BookOpen } from 'lucide-react';
import { LessonItem } from '@/hooks/use-class-creation-store';
import LessonForm from './LessonForm';

interface LessonCardProps {
  lesson: LessonItem;
  index: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onRemoveLesson: (index: number) => void;
  onLessonUpdate: (index: number, field: string, value: any) => void;
  onObjectiveChange: (lessonIndex: number, objectiveIndex: number, value: string) => void;
  onAddObjective: (lessonIndex: number) => void;
  onRemoveObjective: (lessonIndex: number, objectiveIndex: number) => void;
}

const LessonCard = ({
  lesson,
  index,
  isExpanded,
  onToggleExpanded,
  onRemoveLesson,
  onLessonUpdate,
  onObjectiveChange,
  onAddObjective,
  onRemoveObjective
}: LessonCardProps) => {
  return (
    <Card className="border-2">
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50"
        onClick={onToggleExpanded}
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
                onRemoveLesson(index);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <LessonForm
          lesson={lesson}
          index={index}
          onLessonUpdate={onLessonUpdate}
          onObjectiveChange={onObjectiveChange}
          onAddObjective={onAddObjective}
          onRemoveObjective={onRemoveObjective}
        />
      )}
    </Card>
  );
};

export default LessonCard;