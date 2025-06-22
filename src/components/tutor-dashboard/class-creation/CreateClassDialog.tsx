
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Play } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import ClassCreationStepper from "./ClassCreationStepper";
import ClassTypeStep from "./steps/ClassTypeStep";
import DetailsStep from "./steps/DetailsStep";
import ScheduleStep from "./steps/ScheduleStep";
import PricingStep from "./steps/PricingStep";
import LocationStep from "./steps/LocationStep";
import CurriculumStep from "./steps/CurriculumStep";
import PreviewStep from "./steps/PreviewStep";
import { useClassCreationStore } from "@/hooks/use-class-creation-store";
import { autoFillClassCreation } from "@/testing/autoFill";
import ClassTypeSelector from "./ClassTypeSelector";
import { LectureType } from "@/types/lecture-types";
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
}

const CreateClassDialog = ({ open, onOpenChange, onClassCreated }: CreateClassDialogProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    reset, 
    formState,
    setDeliveryMode,
    setClassFormat,
    setClassSize,
    setDurationType,
    setBasicDetails,
    setSchedule,
    setPricing,
    setLocation,
    setSyllabus
  } = useClassCreationStore();

  const updateFormState = (newState: any) => {
    // Helper function to update form state based on the current step
    if (newState.deliveryMode) setDeliveryMode(newState.deliveryMode);
    if (newState.classFormat) setClassFormat(newState.classFormat);
    if (newState.classSize) setClassSize(newState.classSize);
    if (newState.durationType) setDurationType(newState.durationType);
    
    if (newState.title || newState.subject || newState.description || newState.thumbnailUrl) {
      setBasicDetails({
        title: newState.title || formState.title,
        subject: newState.subject || formState.subject,
        description: newState.description || formState.description,
        thumbnailUrl: newState.thumbnailUrl || formState.thumbnailUrl
      });
    }
    
    if (newState.frequency || newState.startDate || newState.endDate || newState.totalSessions || newState.timeSlots) {
      setSchedule({
        frequency: newState.frequency || formState.frequency,
        startDate: newState.startDate || formState.startDate,
        endDate: newState.endDate || formState.endDate,
        totalSessions: newState.totalSessions || formState.totalSessions
      });
      // If timeSlots are provided, handle them separately
    }
    
    if (newState.price || newState.currency || newState.maxStudents !== undefined || newState.autoRenewal !== undefined) {
      setPricing({
        price: newState.price !== undefined ? newState.price : formState.price,
        currency: newState.currency || formState.currency,
        maxStudents: newState.maxStudents !== undefined ? newState.maxStudents : formState.maxStudents,
        autoRenewal: newState.autoRenewal !== undefined ? newState.autoRenewal : formState.autoRenewal
      });
    }
    
    if (newState.meetingLink || newState.address) {
      setLocation({
        meetingLink: newState.meetingLink || formState.meetingLink,
        address: newState.address || formState.address
      });
    }
    
    if (newState.syllabus) {
      setSyllabus(newState.syllabus);
    }
  };

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

  const handleSaveAsDraft = async () => {
    setIsPublishing(true);
    try {
      await saveClass('draft');
      toast({
        title: "Saved as draft",
        description: "Your class has been saved as a draft.",
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
      await saveClass('active');
      toast({
        title: "Class published!",
        description: "Your class is now live and students can enroll.",
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

  const saveClass = async (status: 'draft' | 'active') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be logged in to create a class');

    // Create the main class record
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .insert({
        title: formState.title,
        description: formState.description,
        subject: formState.subject,
        delivery_mode: formState.deliveryMode,
        class_format: formState.classFormat,
        class_size: formState.classSize,
        duration_type: formState.durationType,
        status: status,
        price: formState.price,
        currency: formState.currency,
        max_students: formState.maxStudents,
        auto_renewal: formState.autoRenewal,
        thumbnail_url: formState.thumbnailUrl,
        tutor_id: user.id,
        frequency: formState.frequency,
        total_sessions: formState.totalSessions
      })
      .select('id')
      .single();

    if (classError) throw classError;
    const classId = classData.id;

    // Save schedule if available
    if (formState.startDate) {
      await supabase.from('class_schedules').insert({
        class_id: classId,
        start_date: formState.startDate,
        end_date: formState.endDate,
        frequency: formState.frequency,
        total_sessions: formState.totalSessions
      });
    }

    // Save time slots
    if (formState.timeSlots.length > 0) {
      await supabase.from('class_time_slots').insert(
        formState.timeSlots.map(slot => ({
          class_id: classId,
          day_of_week: slot.day,
          start_time: slot.startTime,
          end_time: slot.endTime
        }))
      );
    }

    // Save location information
    const locationData: any = { class_id: classId };
    if (formState.deliveryMode === 'online' && formState.meetingLink) {
      locationData.meeting_link = formState.meetingLink;
    } else if (formState.deliveryMode === 'offline') {
      locationData.street_address = formState.address.street;
      locationData.city = formState.address.city;
      locationData.state = formState.address.state;
      locationData.zip_code = formState.address.zipCode;
      locationData.country = formState.address.country;
    }
    
    if (Object.keys(locationData).length > 1) {
      await supabase.from('class_locations').insert(locationData);
    }

    // For now, we'll skip saving syllabus and materials until the database schema is updated
    // This prevents the TypeScript errors with class_materials table
    console.log('Syllabus and materials will be saved once database schema is updated');
  };

  const handleAutoFill = () => {
    setTypeSelectorOpen(true);
  };

  const handleSelectClassType = async (selectedType: LectureType) => {
    toast({
      title: "Test Mode Activated",
      description: `Auto-filling ${selectedType} class creation form...`,
    });
    await autoFillClassCreation(selectedType, setCurrentStep, () => {});
  };

  const getClassCategoryLabel = () => {
    const { deliveryMode, classFormat, classSize } = formState;
    
    if (!deliveryMode || !classFormat || !classSize) return "Classes";
    
    let category = deliveryMode === "online" ? "Online" : "Offline";
    let format = "";
    
    if (deliveryMode === "online") {
      format = classFormat === "live" ? "Live" : "Recorded";
    } else {
      format = classFormat === "inbound" ? "Inbound" : "Outbound";
    }
    
    const size = classSize === "group" ? "Group" : "One-on-One";
    
    return `${category} ${format} ${size} Classes`;
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
          <DialogHeader className="px-6 pt-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-[#1F4E79]">Create New Class</DialogTitle>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={() => setTypeSelectorOpen(true)}
                        variant="outline" 
                        size="sm"
                        className="gap-1 border-[#1F4E79]/20 bg-amber-50 text-amber-700 hover:bg-amber-100"
                      >
                        <Play className="h-3.5 w-3.5" />
                        Test
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Auto-fill form for testing</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DialogClose asChild onClick={handleClose}>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </DialogClose>
              </div>
            </div>
            <ClassCreationStepper 
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleJumpToStep}
            />
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[calc(90vh-150px)] px-6 py-4">
            {renderStep()}
          </div>
          
          {currentStep === 6 && (
            <DialogFooter className="px-6 py-4 border-t">
              <Button 
                variant="outline" 
                onClick={handleSaveAsDraft}
                disabled={isPublishing}
                className="bg-white hover:bg-gray-50"
              >
                Save as Draft
              </Button>
              <Button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="bg-[#1F4E79] hover:bg-[#1a4369]"
              >
                {isPublishing ? "Publishing..." : "Publish Now"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      
      <ClassTypeSelector 
        open={typeSelectorOpen}
        onClose={() => setTypeSelectorOpen(false)}
        onSelectType={async (selectedType: LectureType) => {
          toast({
            title: "Test Mode Activated",
            description: `Auto-filling ${selectedType} class creation form...`,
          });
          await autoFillClassCreation(selectedType, setCurrentStep, () => {});
        }}
      />
    </>
  );
};

export default CreateClassDialog;
