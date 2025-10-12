import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const tutorApplicationSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  expertise: z.string().min(1, "Please list at least one area of expertise"),
  experience_years: z.number().min(0, "Experience must be 0 or more years"),
  education: z.string().min(10, "Please provide your educational background"),
  certifications: z.string().optional(),
  linkedin_url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type TutorApplicationFormData = z.infer<typeof tutorApplicationSchema>;

const TutorApplicationForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TutorApplicationFormData>({
    resolver: zodResolver(tutorApplicationSchema),
    defaultValues: {
      full_name: "",
      email: user?.email || "",
      phone: "",
      bio: "",
      expertise: "",
      experience_years: 0,
      education: "",
      certifications: "",
      linkedin_url: "",
    },
  });

  const onSubmit = async (data: TutorApplicationFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit your application",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("tutor_applications").insert({
        user_id: user.id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        expertise: data.expertise.split(",").map((e) => e.trim()),
        experience_years: data.experience_years,
        education: data.education,
        certifications: data.certifications ? data.certifications.split(",").map((c) => c.trim()) : [],
        linkedin_url: data.linkedin_url,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "We'll review your application and get back to you within 1-2 weeks.",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout
      title="Apply to Become a Tutor"
      description="Join our community of passionate educators and start teaching students worldwide."
    >
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Tutor Application</CardTitle>
          <CardDescription>
            Fill out this form to apply as a tutor on TalentSchool. We'll review your application and contact you within 1-2 weeks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself, your teaching philosophy, and what makes you passionate about education..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Minimum 50 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expertise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Areas of Expertise *</FormLabel>
                    <FormControl>
                      <Input placeholder="Math, Science, Coding (comma-separated)" {...field} />
                    </FormControl>
                    <FormDescription>List the subjects you can teach, separated by commas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience_years"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Teaching Experience *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="5"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education Background *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Bachelor's in Computer Science from MIT, Master's in Education from Harvard..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certifications (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Teaching license, Subject certifications (comma-separated)" {...field} />
                    </FormControl>
                    <FormDescription>List any relevant certifications, separated by commas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedin_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default TutorApplicationForm;
