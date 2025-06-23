
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import ClassTypeStep from "./steps/ClassTypeStep";
import DetailsStep from "./steps/DetailsStep";
import ScheduleStep from "./steps/ScheduleStep";
import PricingStep from "./steps/PricingStep";
import LocationStep from "./steps/LocationStep";
import CurriculumStep from "./steps/CurriculumStep";
import PreviewStep from "./steps/PreviewStep";
import { useClassCreationStore, FormState, DayOfWeek } from "@/hooks/use-class-creation-store";
import { autoFillClassCreation } from "@/testing/autoFill";
import ClassTypeSelector from "./ClassTypeSelector";
import { LectureType } from "@/types/lecture-types";
import { useFormStateManager } from "@/hooks/use-form-state-manager";
import { saveClass } from "@/services/class-creation-service";
import ClassCreationHeader from "./ClassCreationHeader";
import DialogActions from "./DialogActions";
import { TutorClass } from "@/hooks/use-tutor-classes";
import { supabase } from "@/integrations/supabase/client";

const steps = [
  "Delivery & Type",
  "Details", 
  "Schedule",
  "Pricing & Capacity",
  "Location/Links",
  "Curriculum",
  "Preview & Publish"
];

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClassCreated?: () => void;
  editingClass?: TutorClass | null;
}

const CreateClassDialog = ({ open, onOpenChange, onClassCreated, editingClass }: CreateClassDialogProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { reset, formState, setDeliveryMode, setClassFormat, setClassSize, setDurationType, setBasicDetails, setSchedule, setPricing, setLocation, setSyllabus, addMaterial, setTimeSlots } = useClassCreationStore();
  const { updateFormState } = useFormStateManager();

  // Load existing class data when editing
  useEffect(() => {
    const loadClassData = async () => {
      if (editingClass && open) {
        console.log('Loading existing class data:', editingClass);
        
        // Set basic class details
        setDeliveryMode(editingClass.delivery_mode);
        setClassFormat(editingClass.class_format);
        setClassSize(editingClass.class_size);
        setDurationType(editingClass.duration_type);
        
        setBasicDetails({
          title: editingClass.title || '',
          subject: editingClass.subject || '',
          description: editingClass.description || '',
          thumbnailUrl: editingClass.thumbnail_url || ''
        });
        
        setPricing({
          price: editingClass.price || null,
          currency: editingClass.currency || 'USD',
          maxStudents: editingClass.max_students || null,
          autoRenewal: editingClass.auto_renewal || false
        });

        try {
          // Load schedule data
          const { data: scheduleData } = await supabase
            .from('class_schedules')
            .select('*')
            .eq('class_id', editingClass.id)
            .maybeSingle();

          if (scheduleData) {
            setSchedule({
              frequency: scheduleData.frequency as any,
              startDate: scheduleData.start_date,
              endDate: scheduleData.end_date,
              totalSessions: scheduleData.total_sessions
            });
          }

          // Load time slots data
          const { data: timeSlotsData } = await supabase
            .from('class_time_slots')
            .select('*')
            .eq('class_id', editingClass.id)
            .order('day_of_week');

          if (timeSlotsData && timeSlotsData.length > 0) {
            const timeSlots = timeSlotsData.map(slot => ({
              dayOfWeek: slot.day_of_week as DayOfWeek,
              startTime: slot.start_time,
              endTime: slot.end_time
            }));
            setTimeSlots(timeSlots);
          }

          // Load location data
          const { data: locationData } = await supabase
            .from('class_locations')
            .select('*')
            .eq('class_id', editingClass.id)
            .maybeSingle();

          if (locationData) {
            setLocation({
              meetingLink: locationData.meeting_link || '',
              address: {
                street: locationData.street || '',
                city: locationData.city || '',
                state: locationData.state || '',
                zipCode: locationData.zip_code || '',
                country: locationData.country || ''
              }
            });
          }

          // Load syllabus data
          const { data: syllabusData } = await supabase
            .from('class_syllabus')
            .select('*')
            .eq('class_id', editingClass.id)
            .order('week_number');

          if (syllabusData && syllabusData.length > 0) {
            const syllabus = syllabusData.map(item => ({
              title: item.title,
              description: item.description || ''
            }));
            setSyllabus(syllabus);

            // Load materials for each lesson
            for (const lesson of syllabusData) {
              const { data: materialsData } = await supabase
                .from('lesson_materials')
                .select('*')
                .eq('lesson_id', lesson.id)
                .order('display_order');

              if (materialsData && materialsData.length > 0) {
                materialsData.forEach(material => {
                  addMaterial({
                    name: material.material_name,
                    type: material.material_type,
                    url: material.material_url,
                    lessonIndex: lesson.week_number - 1
                  });
                });
              }
            }
          }
        } catch (error) {
          console.error('Error loading class data:', error);
          toast({
            title: "Error loading class data",
            description: "Some class details may not be loaded correctly.",
            variant: "destructive"
          });
        }
      }
    };

    loadClassData();
  }, [editingClass, open]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after dialog closes
    setTimeout(() => {
      setCurrentStep(0);
      reset();
    }, 300);
  };

  const handleJumpToStep = (step: number) => {
    setCurrentStep(step);
  };

  // Transform formState to match FormState structure
  const transformFormState = (): FormState => {
    return {
      deliveryMode: formState.deliveryMode,
      classFormat: formState.classFormat,
      classSize: formState.classSize,
      durationType: formState.durationType,
      basicDetails: {
        title: formState.title,
        subject: formState.subject,
        description: formState.description,
        thumbnailUrl: formState.thumbnailUrl,
      },
      schedule: {
        frequency: formState.frequency,
        startDate: formState.startDate,
        endDate: formState.endDate,
        totalSessions: formState.totalSessions,
      },
      timeSlots: formState.timeSlots,
      pricing: {
        price: formState.price,
        currency: formState.currency,
        maxStudents: formState.maxStudents,
        autoRenewal: formState.autoRenewal,
      },
      location: {
        meetingLink: formState.meetingLink,
        address: formState.address,
      },
      syllabus: formState.syllabus,
      materials: formState.materials,
    };
  };

  const handleSaveAsDraft = async () => {
    setIsPublishing(true);
    try {
      const transformedFormState = transformFormState();
      await saveClass(transformedFormState, 'draft', editingClass?.id);
      toast({
        title: editingClass ? "Class updated" : "Saved as draft",
        description: editingClass ? "Your class has been updated successfully." : "Your class has been saved as a draft.",
      });
      handleClose();
      onClassCreated?.();
    } catch (error: any) {
      toast({
        title: "Error saving draft",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const transformedFormState = transformFormState();
      await saveClass(transformedFormState, 'active', editingClass?.id);
      toast({
        title: editingClass ? "Class updated and published!" : "Class published!",
        description: editingClass ? "Your class changes have been saved and published." : "Your class is now live and students can enroll.",
      });
      handleClose();
      onClassCreated?.();
    } catch (error: any) {
      toast({
        title: "Error publishing class",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSelectClassType = async (selectedType: LectureType) => {
    toast({
      title: "Test Mode Activated",
      description: `Auto-filling ${selectedType} class creation form...`,
    });
    await autoFillClassCreation(selectedType, setCurrentStep, updateFormState);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ClassTypeStep onNext={handleNext} />;
      case 1:
        return <DetailsStep onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <ScheduleStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <PricingStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <LocationStep onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <CurriculumStep onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <PreviewStep onBack={handleBack} onSaveAsDraft={handleSaveAsDraft} onPublish={handlePublish} />;
      default:
        return <ClassTypeStep onNext={handleNext} />;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden max-h-[90vh]">
          <ClassCreationHeader
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleJumpToStep}
            onTestClick={() => setTypeSelectorOpen(true)}
            onClose={handleClose}
            editingClass={editingClass}
          />
          
          <div className="overflow-y-auto max-h-[calc(90vh-150px)] px-6 py-4">
            {renderStep()}
          </div>
          
          {currentStep === 6 && (
            <DialogActions
              isPublishing={isPublishing}
              onSaveAsDraft={handleSaveAsDraft}
              onPublish={handlePublish}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <ClassTypeSelector 
        open={typeSelectorOpen}
        onClose={() => setTypeSelectorOpen(false)}
        onSelectType={handleSelectClassType}
      />
    </>
  );
};

export default CreateClassDialog;
