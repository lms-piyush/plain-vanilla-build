
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useClassCreationStore } from '@/hooks/use-class-creation-store';
import { formatTime, parseTime } from '@/utils/time-helpers';

const CurriculumStep = () => {
  const { formState, setSyllabus } = useClassCreationStore();
  const { syllabus, frequency, startDate, timeSlots } = formState;
  const [expandedSession, setExpandedSession] = useState<number | null>(null);

  const calculateSessionDate = (sessionIndex: number) => {
    if (!startDate || !frequency || !timeSlots.length) return null;
    
    const startDateObj = new Date(startDate);
    let sessionDate = new Date(startDateObj);
    
    switch (frequency) {
      case 'daily':
        sessionDate.setDate(startDateObj.getDate() + sessionIndex);
        break;
      case 'weekly':
        sessionDate.setDate(startDateObj.getDate() + (sessionIndex * 7));
        break;
      case 'monthly':
        sessionDate.setMonth(startDateObj.getMonth() + sessionIndex);
        break;
      default:
        return null;
    }
    
    return sessionDate;
  };

  const addSession = () => {
    const sessionDate = calculateSessionDate(syllabus.length);
    const firstTimeSlot = timeSlots[0];
    
    const newSession = {
      title: `Session ${syllabus.length + 1}`,
      description: '',
      learningObjectives: [''],
      weekNumber: syllabus.length + 1,
      sessionDate: sessionDate ? sessionDate.toISOString().split('T')[0] : '',
      startTime: firstTimeSlot?.startTime || '10:00',
      endTime: firstTimeSlot?.endTime || '11:00',
      status: 'upcoming' as const,
      notes: ''
    };

    setSyllabus([...syllabus, newSession]);
  };

  const removeSession = (index: number) => {
    const newSyllabus = syllabus.filter((_, i) => i !== index);
    setSyllabus(newSyllabus.map((session, i) => ({
      ...session,
      title: `Session ${i + 1}`,
      weekNumber: i + 1
    })));
  };

  const updateSession = (index: number, field: string, value: any) => {
    const newSyllabus = [...syllabus];
    newSyllabus[index] = { ...newSyllabus[index], [field]: value };
    setSyllabus(newSyllabus);
  };

  const updateLearningObjective = (sessionIndex: number, objIndex: number, value: string) => {
    const newSyllabus = [...syllabus];
    const newObjectives = [...newSyllabus[sessionIndex].learningObjectives];
    newObjectives[objIndex] = value;
    newSyllabus[sessionIndex] = { ...newSyllabus[sessionIndex], learningObjectives: newObjectives };
    setSyllabus(newSyllabus);
  };

  const addLearningObjective = (sessionIndex: number) => {
    const newSyllabus = [...syllabus];
    newSyllabus[sessionIndex] = {
      ...newSyllabus[sessionIndex],
      learningObjectives: [...newSyllabus[sessionIndex].learningObjectives, '']
    };
    setSyllabus(newSyllabus);
  };

  const removeLearningObjective = (sessionIndex: number, objIndex: number) => {
    const newSyllabus = [...syllabus];
    const newObjectives = newSyllabus[sessionIndex].learningObjectives.filter((_, i) => i !== objIndex);
    newSyllabus[sessionIndex] = { ...newSyllabus[sessionIndex], learningObjectives: newObjectives };
    setSyllabus(newSyllabus);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Class Curriculum</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create your class curriculum by adding sessions. Each session will be automatically scheduled based on your class frequency.
        </p>
      </div>

      <div className="space-y-4">
        {syllabus.map((session, sessionIndex) => (
          <Card key={sessionIndex} className="w-full">
            <CardHeader 
              className="cursor-pointer" 
              onClick={() => setExpandedSession(expandedSession === sessionIndex ? null : sessionIndex)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base">{session.title}</CardTitle>
                  <Badge variant="outline">Week {session.weekNumber}</Badge>
                  {session.sessionDate && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(session.sessionDate).toLocaleDateString()}
                    </Badge>
                  )}
                  {session.startTime && session.endTime && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {session.startTime} - {session.endTime}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSession(sessionIndex);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {expandedSession === sessionIndex && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`session-title-${sessionIndex}`}>Session Title</Label>
                    <Input
                      id={`session-title-${sessionIndex}`}
                      value={session.title}
                      onChange={(e) => updateSession(sessionIndex, 'title', e.target.value)}
                      placeholder="Session title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`session-date-${sessionIndex}`}>Session Date</Label>
                    <Input
                      id={`session-date-${sessionIndex}`}
                      type="date"
                      value={session.sessionDate}
                      onChange={(e) => updateSession(sessionIndex, 'sessionDate', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`start-time-${sessionIndex}`}>Start Time</Label>
                    <Input
                      id={`start-time-${sessionIndex}`}
                      type="time"
                      value={session.startTime}
                      onChange={(e) => updateSession(sessionIndex, 'startTime', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`end-time-${sessionIndex}`}>End Time</Label>
                    <Input
                      id={`end-time-${sessionIndex}`}
                      type="time"
                      value={session.endTime}
                      onChange={(e) => updateSession(sessionIndex, 'endTime', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`session-description-${sessionIndex}`}>Description</Label>
                  <Textarea
                    id={`session-description-${sessionIndex}`}
                    value={session.description}
                    onChange={(e) => updateSession(sessionIndex, 'description', e.target.value)}
                    placeholder="Session description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Learning Objectives</Label>
                  <div className="space-y-2 mt-2">
                    {session.learningObjectives.map((objective, objIndex) => (
                      <div key={objIndex} className="flex items-center gap-2">
                        <Input
                          value={objective}
                          onChange={(e) => updateLearningObjective(sessionIndex, objIndex, e.target.value)}
                          placeholder={`Learning objective ${objIndex + 1}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeLearningObjective(sessionIndex, objIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addLearningObjective(sessionIndex)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Learning Objective
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor={`session-notes-${sessionIndex}`}>Additional Notes</Label>
                  <Textarea
                    id={`session-notes-${sessionIndex}`}
                    value={session.notes}
                    onChange={(e) => updateSession(sessionIndex, 'notes', e.target.value)}
                    placeholder="Additional notes for this session"
                    rows={2}
                  />
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Button type="button" onClick={addSession} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add New Session
      </Button>
    </div>
  );
};

export default CurriculumStep;
