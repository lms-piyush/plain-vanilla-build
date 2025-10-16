import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, BookOpen, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const EnrollmentSuccess = () => {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();

  // Fetch enrollment details
  const { data: enrollment, isLoading } = useQuery({
    queryKey: ['enrollment', enrollmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_enrollments')
        .select(`
          *,
          class:classes(
            id,
            title,
            description,
            thumbnail_url,
            tutor_id,
            class_schedules(start_date, end_date),
            class_time_slots(day_of_week, start_time, end_time)
          )
        `)
        .eq('id', enrollmentId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!enrollmentId
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Not Found</CardTitle>
            <CardDescription>We couldn't find this enrollment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/student/my-classes')}>
              View My Classes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const classData = enrollment.class as any;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader className="text-center pb-2">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-3xl">Enrollment Successful!</CardTitle>
          <CardDescription className="text-lg">
            You're all set to start learning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Class Info */}
          <div className="flex gap-4 items-start p-4 border rounded-lg">
            {classData.thumbnail_url && (
              <img
                src={classData.thumbnail_url}
                alt={classData.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-xl mb-1">{classData.title}</h3>
              <p className="text-muted-foreground line-clamp-2">{classData.description}</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg">What's Next?</h4>
            
            <div className="flex gap-3 items-start">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Check Your Schedule</p>
                <p className="text-sm text-muted-foreground">
                  View your class schedule and upcoming sessions
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <BookOpen className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Access Course Materials</p>
                <p className="text-sm text-muted-foreground">
                  Download materials and prepare for your first session
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Connect with Your Tutor</p>
                <p className="text-sm text-muted-foreground">
                  Send a message to introduce yourself
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              className="flex-1"
              onClick={() => navigate(`/student/classes/${classData.id}`)}
            >
              Go to Class Page
            </Button>
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/student/my-classes')}
            >
              View My Classes
            </Button>
          </div>

          {/* Confirmation Email Notice */}
          <p className="text-sm text-muted-foreground text-center pt-2 border-t">
            A confirmation email has been sent to your inbox with class details.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnrollmentSuccess;