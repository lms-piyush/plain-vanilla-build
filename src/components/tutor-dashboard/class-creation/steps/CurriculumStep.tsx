
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
}

interface CurriculumStepProps {
  onNext: () => void;
  onBack: () => void;
}

const CurriculumStep = ({ onNext, onBack }: CurriculumStepProps) => {
  const { formState, setSyllabus } = useClassCreationStore();
  
  const [lessons, setLessons] = useState<LessonWithMaterials[]>(
    formState.syllabus.length > 0 
      ? formState.syllabus.map(lesson => ({ ...lesson, materials: [] }))
      : [{ title: "Introduction", description: "", materials: [] }]
  );
  
  const [errors, setErrors] = useState({
    syllabus: ""
  });
  
  const validateForm = () => {
    const newErrors = {
      syllabus: ""
    };
    
    if (lessons.some(lesson => !lesson.title.trim())) {
      newErrors.syllabus = "All lesson titles are required";
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleNext = () => {
    if (validateForm()) {
      // Convert lessons back to syllabus format for store
      setSyllabus(lessons.map(lesson => ({
        title: lesson.title,
        description: lesson.description
      })));
      onNext();
    }
  };
  
  const handleAddLesson = () => {
    setLessons([
      ...lessons,
      { title: `Lesson ${lessons.length + 1}`, description: "", materials: [] }
    ]);
  };
  
  const handleRemoveLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };
  
  const handleLessonChange = (index: number, field: 'title' | 'description', value: string) => {
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
              <div key={lessonIndex} className="border rounded-lg overflow-hidden bg-white">
                <Collapsible defaultOpen={lessonIndex === 0}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 text-left hover:bg-gray-100 border-b">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <span className="font-medium">{lesson.title || `Lesson ${lessonIndex + 1}`}</span>
                      {lesson.materials.length > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {lesson.materials.length} materials
                        </span>
                      )}
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveLesson(lessonIndex);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="p-4">
                    <div className="space-y-4">
                      {/* Lesson Details */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`lesson-title-${lessonIndex}`} className="text-sm">
                            Lesson Title <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`lesson-title-${lessonIndex}`}
                            value={lesson.title}
                            onChange={(e) => handleLessonChange(lessonIndex, "title", e.target.value)}
                            placeholder="Enter lesson title"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`lesson-description-${lessonIndex}`} className="text-sm">
                            Description
                          </Label>
                          <Textarea
                            id={`lesson-description-${lessonIndex}`}
                            value={lesson.description}
                            onChange={(e) => handleLessonChange(lessonIndex, "description", e.target.value)}
                            placeholder="What will students learn in this lesson?"
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                      
                      {/* Materials Section */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-sm">Lesson Materials</h4>
                          <div className="flex gap-2">
                            <div className="relative">
                              <Input
                                id={`file-upload-${lessonIndex}`}
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, lessonIndex)}
                              />
                              <Label 
                                htmlFor={`file-upload-${lessonIndex}`} 
                                className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-xs cursor-pointer hover:bg-blue-600"
                              >
                                <FileUp className="h-3 w-3" />
                                Upload
                              </Label>
                            </div>
                            
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              className="text-xs px-3 py-1 h-auto"
                              onClick={() => handleAddUrl(lessonIndex)}
                            >
                              <Link2 className="h-3 w-3 mr-1" />
                              Add URL
                            </Button>
                          </div>
                        </div>
                        
                        {/* Materials List */}
                        {lesson.materials.length > 0 ? (
                          <div className="space-y-2">
                            {lesson.materials.map((material, materialIndex) => (
                              <div key={materialIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{getMaterialIcon(material.type)}</span>
                                  <span className="text-sm font-medium truncate max-w-[200px]">
                                    {material.name}
                                  </span>
                                  <span className="text-xs text-gray-500 capitalize">
                                    {material.type}
                                  </span>
                                </div>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 text-red-500"
                                  onClick={() => handleRemoveMaterial(lessonIndex, materialIndex)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-xs text-center py-3 bg-gray-50 rounded">
                            No materials added yet
                          </p>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="font-medium text-[#1F4E79] mb-2">Curriculum Tips</h4>
          <ul className="text-sm space-y-2 list-disc list-inside text-gray-700">
            <li>Break down your content into clear, manageable lessons</li>
            <li>Include learning objectives for each lesson</li>
            <li>Add materials directly to each lesson for better organization</li>
            <li>Support files: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, PNG, JPG, MP4</li>
            <li>Consider including pre-class preparation materials</li>
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
