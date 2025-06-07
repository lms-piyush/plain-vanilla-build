
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const createClassSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  deliveryMode: z.enum(["online", "offline"]),
  sessionLink: z.string().optional(),
  offlineType: z.enum(["group", "one-on-one"]).optional(),
});

type CreateClassFormValues = z.infer<typeof createClassSchema>;

interface SimpleCreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClassCreated: () => void;
}

const SimpleCreateClassDialog = ({ open, onOpenChange, onClassCreated }: SimpleCreateClassDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<CreateClassFormValues>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      title: "",
      description: "",
      deliveryMode: "online",
      sessionLink: "",
      offlineType: "group",
    },
  });

  const deliveryMode = form.watch("deliveryMode");

  const onSubmit = async (data: CreateClassFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a class.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create the main class record
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

      form.reset();
      onClassCreated();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating class:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create class. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#1F4E79]">Create New Class</DialogTitle>
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
                {isLoading ? "Creating..." : "Create Class"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleCreateClassDialog;
