import { useState } from "react";
import { useClassCreationStore } from "@/hooks/use-class-creation-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical, FileUp, Link2 } from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { uploadCourseMaterial } from "@/services/file-upload-service";
import { toast } from "@/components/ui/sonner";

interface Material {
  name: string;
  type: string;
  url: string;
}

interface LessonWithMaterials {
  title: string;
  description: string;
  materials: Material[];
  session_date?: string;
  start_time?: string;
  end_time?: string;
  week_number?: number;
}

interface CurriculumStepProps {
  onNext: () => void;
  onBack: () => void;
}

const CurriculumStep = ({ onNext, onBack }: CurriculumStepProps) => {
  const { formState, setSyllabus, addMaterial } = useClassCreationStore();
  
  // Initialize lessons with proper session dates and times
  const initializeLessons = () => {
    if (formState.syllabus.length > 0) {
      return formState.syllabus.map((lesson, index) => ({ 
        ...lesson, 
        materials: [],
        session_date: calculateSessionDate(index),
        start_time: getDefaultTimeSlot().start_time,
        end_time: getDefaultTimeSlot().end_time,
        week_number: index + 1
      }));
    }
    return [{ 
      title: "Introduction", 
      description: "", 
      materials: [],
      session_date: calculateSessionDate(0),
      start_time: getDefaultTimeSlot().start_time,
      end_time: getDefaultTimeSlot().end_time,
      week_number: 1
    }];
  };
  
  const [lessons, setLessons] = useState<LessonWithMaterials[]>(initializeLessons);
  
  const [errors, setErrors] = useState({
    syllabus: ""
  });

  // Helper function to calculate session date based on frequency and index
  const calculateSessionDate = (index: number): string => {
    if (!formState.startDate || !formState.frequency) {
      return new Date().toISOString().split('T')[0];
    }

    const startDate = new Date(formState.startDate);
    const sessionDate = new Date(startDate);

    switch (formState.frequency) {
      case 'daily':
        sessionDate.setDate(startDate.getDate() + index);
        break;
      case 'weekly':
        sessionDate.setDate(startDate.getDate() + (index * 7));
        break;
      case 'monthly':
        sessionDate.setMonth(startDate.getMonth() + index);
        break;
      default:
        sessionDate.setDate(startDate.getDate() + (index * 7)); // Default to weekly
    }

    return sessionDate.toISOString().split('T')[0];
  };

  // Helper function to get default time slot
  const getDefaultTimeSlot = () => {
    if (formState.timeSlots && formState.timeSlots.length > 0) {
      return {
        start_time: formState.timeSlots[0].startTime,
        end_time: formState.timeSlots[0].endTime
      };
    }
    return {
      start_time: '09:00',
      end_time: '10:00'
    };
  };
  
  const validateForm = () => {
    const newErrors = {
      syllabus: ""
    };
    
    if (lessons.some(lesson => !lesson.title.trim())) {
      newErrors.syllabus = "All lesson titles are required";
    }
    
    if (lessons.some(lesson => !lesson.session_date)) {
      newErrors.syllabus = "All lessons must have a session date";
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleNext = () => {
    if (validateForm()) {
      // Convert lessons to syllabus format with session details for database storage
      const syllabusWithSchedule = lessons.map((lesson, index) => ({
        title: lesson.title,
        description: lesson.description,
        session_date: lesson.session_date,
        start_time: lesson.start_time,
        end_time: lesson.end_time,
        week_number: lesson.week_number || index + 1
      }));
      
      // Store the enhanced syllabus data
      setSyllabus(syllabusWithSchedule);
      
      // Add all materials to the store with their lesson associations
      lessons.forEach((lesson, lessonIndex) => {
        lesson.materials.forEach(material => {
          addMaterial({
            ...material,
            lessonIndex
          });
        });
      });
      
      onNext();
    }
  };
  
  const handleAddLesson = () => {
    const newIndex = lessons.length;
    const defaultTime = getDefaultTimeSlot();
    
    const newLesson: LessonWithMaterials = { 
      title: `Lesson ${lessons.length + 1}`, 
      description: "", 
      materials: [],
      session_date: calculateSessionDate(newIndex),
      start_time: defaultTime.start_time,
      end_time: defaultTime.end_time,
      week_number: newIndex + 1
    };
    
    setLessons([...lessons, newLesson]);
  };
  
  const handleRemoveLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };
  
  const handleLessonChange = (index: number, field: keyof LessonWithMaterials, value: string) => {
    setLessons(
      lessons.map((lesson, i) => 
        i === index ? { ...lesson, [field]: value } : lesson
      )
    );
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, lessonIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadedMaterial = await uploadCourseMaterial(file);
      
      setLessons(lessons.map((lesson, i) => 
        i === lessonIndex 
          ? { ...lesson, materials: [...lesson.materials, uploadedMaterial] }
          : lesson
      ));
      
      toast.success('Material uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload material');
    }
    
    // Reset file input
    e.target.value = '';
  };
  
  const handleAddUrl = (lessonIndex: number) => {
    const url = prompt("Enter URL:");
    if (url && isValidUrl(url)) {
      const newMaterial: Material = {
        name: url.split("/").pop() || "External Resource",
        type: "link",
        url: url
      };
      
      setLessons(lessons.map((lesson, i) => 
        i === lessonIndex 
          ? { ...lesson, materials: [...lesson.materials, newMaterial] }
          : lesson
      ));
    } else if (url) {
      toast.error("Please enter a valid URL");
    }
  };
  
  const handleRemoveMaterial = (lessonIndex: number, materialIndex: number) => {
    setLessons(lessons.map((lesson, i) => 
      i === lessonIndex 
        ? { ...lesson, materials: lesson.materials.filter((_, mi) => mi !== materialIndex) }
        : lesson
    ));
  };
  
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'pdf': return '📄';
      case 'link': return '🔗';
      default: return '📎';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Course Syllabus</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddLesson}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Lesson
            </Button>
          </div>
          
          {errors.syllabus && (
            <p className="text-red-500 text-sm mb-4">{errors.syllabus}</p>
          )}
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {lessons.map((lesson, lessonIndex) => (
              <div key={lessonIndex} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <Collapsible defaultOpen={lessonIndex === 0}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 text-left hover:bg-gray-100 border-b">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-sm text-gray-600">Week {lesson.week_number}</span>
                        <span className="font-semibold">{lesson.title || `Lesson ${lessonIndex + 1}`}</span>
                        {lesson.session_date && (
                          <span className="text-xs text-gray-500">
                            {new Date(lesson.session_date).toLocaleDateString()} • {lesson.start_time} - {lesson.end_time}
                          </span>
                        )}
                      </div>
                      {lesson.materials.length > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {lesson.materials.length} material{lesson.materials.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveLesson(lessonIndex);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="p-6 bg-white">
                    <div className="space-y-6">
                      {/* Lesson Details */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`lesson-title-${lessonIndex}`} className="text-sm font-medium">
                            Lesson Title <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`lesson-title-${lessonIndex}`}
                            value={lesson.title}
                            onChange={(e) => handleLessonChange(lessonIndex, "title", e.target.value)}
                            placeholder="Enter lesson title"
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`lesson-description-${lessonIndex}`} className="text-sm font-medium">
                            Description
                          </Label>
                          <Textarea
                            id={`lesson-description-${lessonIndex}`}
                            value={lesson.description}
                            onChange={(e) => handleLessonChange(lessonIndex, "description", e.target.value)}
                            placeholder="What will students learn in this lesson?"
                            className="min-h-[80px] resize-none"
                          />
                        </div>
                      </div>

                      {/* Session Schedule */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`session-date-${lessonIndex}`} className="text-sm font-medium">
                            Session Date <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`session-date-${lessonIndex}`}
                            type="date"
                            value={lesson.session_date || calculateSessionDate(lessonIndex)}
                            onChange={(e) => handleLessonChange(lessonIndex, "session_date", e.target.value)}
                            className="w-full"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`start-time-${lessonIndex}`} className="text-sm font-medium">
                            Start Time
                          </Label>
                          <Input
                            id={`start-time-${lessonIndex}`}
                            type="time"
                            value={lesson.start_time || getDefaultTimeSlot().start_time}
                            onChange={(e) => handleLessonChange(lessonIndex, "start_time", e.target.value)}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`end-time-${lessonIndex}`} className="text-sm font-medium">
                            End Time
                          </Label>
                          <Input
                            id={`end-time-${lessonIndex}`}
                            type="time"
                            value={lesson.end_time || getDefaultTimeSlot().end_time}
                            onChange={(e) => handleLessonChange(lessonIndex, "end_time", e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      {/* Materials Section */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-sm">Lesson Materials</h4>
                          <div className="flex gap-2">
                            <div className="relative">
                              <Input
                                id={`file-upload-${lessonIndex}`}
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, lessonIndex)}
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.mp4,.mp3"
                              />
                              <Label 
                                htmlFor={`file-upload-${lessonIndex}`} 
                                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded text-xs cursor-pointer hover:bg-blue-600 transition-colors"
                              >
                                <FileUp className="h-3 w-3" />
                                Upload File
                              </Label>
                            </div>
                            
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              className="text-xs px-3 py-2 h-auto"
                              onClick={() => handleAddUrl(lessonIndex)}
                            >
                              <Link2 className="h-3 w-3 mr-1" />
                              Add Link
                            </Button>
                          </div>
                        </div>
                        
                        {/* Materials List */}
                        {lesson.materials.length > 0 ? (
                          <div className="space-y-2">
                            {lesson.materials.map((material, materialIndex) => (
                              <div key={materialIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{getMaterialIcon(material.type)}</span>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium truncate max-w-[200px]">
                                      {material.name}
                                    </span>
                                    <span className="text-xs text-gray-500 capitalize">
                                      {material.type}
                                    </span>
                                  </div>
                                </div>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRemoveMaterial(lessonIndex, materialIndex)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-md border-2 border-dashed border-gray-200">
                            <p className="text-muted-foreground text-sm">
                              No materials added yet for this lesson
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Upload files or add links to enhance the learning experience
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
          <h4 className="font-medium text-[#1F4E79] mb-2">Curriculum Tips</h4>
          <ul className="text-sm space-y-2 list-disc list-inside text-gray-700">
            <li>Session dates are auto-calculated based on your class frequency and start date</li>
            <li>Start and end times are pre-filled from your time slots configuration</li>
            <li>You can manually adjust dates and times for each lesson as needed</li>
            <li>Session dates and times will be stored and used for scheduling</li>
            <li>Add materials directly to each lesson for better organization</li>
            <li>Support files: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, PNG, JPG, MP4</li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          onClick={handleNext}
          className="bg-[#1F4E79] hover:bg-[#1a4369]"
        >
          Continue to Preview
        </Button>
      </div>
    </div>
  );
};

export default CurriculumStep;
