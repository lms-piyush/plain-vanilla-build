
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { TutorClass } from "@/hooks/use-tutor-classes";

const createClassSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  deliveryMode: z.enum(["online", "offline"]),
  sessionLink: z.string().optional(),
  offlineType: z.enum(["group", "one-on-one"]).optional(),
  scheduleDate: z.date({
    required_error: "Schedule date is required",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

type CreateClassFormValues = z.infer<typeof createClassSchema>;

interface SimpleCreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClassCreated: () => void;
  editingClass?: TutorClass | null;
}

const SimpleCreateClassDialog = ({ open, onOpenChange, onClassCreated, editingClass }: SimpleCreateClassDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditing = !!editingClass;

  const form = useForm<CreateClassFormValues>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      title: "",
      description: "",
      deliveryMode: "online",
      sessionLink: "",
      offlineType: "group",
      startTime: "09:00",
      endTime: "10:00",
    },
  });

  const deliveryMode = form.watch("deliveryMode");

  // Reset form when editing class changes
  useEffect(() => {
    if (editingClass) {
      form.reset({
        title: editingClass.title,
        description: editingClass.description || "",
        deliveryMode: editingClass.delivery_mode,
        sessionLink: editingClass.class_locations?.[0]?.meeting_link || "",
        offlineType: editingClass.class_size as "group" | "one-on-one",
        scheduleDate: new Date(), // Default to today since we don't have schedule data
        startTime: "09:00",
        endTime: "10:00",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        deliveryMode: "online",
        sessionLink: "",
        offlineType: "group",
        startTime: "09:00",
        endTime: "10:00",
      });
    }
  }, [editingClass, form]);

  const onSubmit = async (data: CreateClassFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a class.",
        variant: "destructive",
      });
      return;
    }

    // Validate end time is after start time
    if (data.startTime >= data.endTime) {
      toast({
        title: "Error",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing && editingClass) {
        // Update existing class
        const { error: classError } = await supabase
          .from("classes")
          .update({
            title: data.title,
            description: data.description || "",
            delivery_mode: data.deliveryMode,
            class_format: data.deliveryMode === "online" ? "live" : "inbound",
            class_size: data.deliveryMode === "online" ? "group" : (data.offlineType || "group"),
          })
          .eq("id", editingClass.id);

        if (classError) throw classError;

        // Update location if online class with session link
        if (data.deliveryMode === "online" && data.sessionLink) {
          const { error: locationError } = await supabase
            .from("class_locations")
            .upsert({
              class_id: editingClass.id,
              meeting_link: data.sessionLink,
            });

          if (locationError) throw locationError;
        }

        toast({
          title: "Success",
          description: "Class updated successfully!",
        });
      } else {
        // Create new class
        const { data: classData, error: classError } = await supabase
          .from("classes")
          .insert({
            tutor_id: user.id,
            title: data.title,
            description: data.description || "",
            delivery_mode: data.deliveryMode,
            class_format: data.deliveryMode === "online" ? "live" : "inbound",
            class_size: data.deliveryMode === "online" ? "group" : (data.offlineType || "group"),
            duration_type: "fixed",
            status: "draft",
          })
          .select()
          .single();

        if (classError) throw classError;

        // Create schedule record
        const { error: scheduleError } = await supabase
          .from("class_schedules")
          .insert({
            class_id: classData.id,
            frequency: "weekly",
            start_date: format(data.scheduleDate, 'yyyy-MM-dd'),
            total_sessions: 1,
          });

        if (scheduleError) throw scheduleError;

        // Create time slot record
        const { error: timeSlotError } = await supabase
          .from("class_time_slots")
          .insert({
            class_id: classData.id,
            day_of_week: format(data.scheduleDate, 'EEEE').toLowerCase(),
            start_time: data.startTime,
            end_time: data.endTime,
          });

        if (timeSlotError) throw timeSlotError;

        // If online class with session link, create location record
        if (data.deliveryMode === "online" && data.sessionLink) {
          const { error: locationError } = await supabase
            .from("class_locations")
            .insert({
              class_id: classData.id,
              meeting_link: data.sessionLink,
            });

          if (locationError) throw locationError;
        }

        toast({
          title: "Success",
          description: "Class created successfully!",
        });
      }

      form.reset();
      onClassCreated();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving class:", error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? 'update' : 'create'} class. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#1F4E79]">
            {isEditing ? 'Edit Class' : 'Create New Class'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter class title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter class description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online">Online</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="offline" id="offline" />
                        <Label htmlFor="offline">Offline</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {deliveryMode === "online" && (
              <FormField
                control={form.control}
                name="sessionLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter meeting link (e.g., Zoom, Google Meet)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {deliveryMode === "offline" && (
              <FormField
                control={form.control}
                name="offlineType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="group" id="group" />
                          <Label htmlFor="group">Group Session</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="one-on-one" id="one-on-one" />
                          <Label htmlFor="one-on-one">One-to-One Session</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="scheduleDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Schedule Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#1F4E79] hover:bg-[#1a4369]"
                disabled={isLoading}
              >
                {isLoading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Class" : "Create Class")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleCreateClassDialog;
