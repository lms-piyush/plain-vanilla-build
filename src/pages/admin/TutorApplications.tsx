import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Eye, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface TutorApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  bio: string;
  expertise: string[];
  experience_years: number;
  education: string;
  certifications: string[] | null;
  linkedin_url: string | null;
  resume_url: string | null;
  status: string;
  created_at: string;
  admin_notes: string | null;
}

const TutorApplications = () => {
  const [selectedApplication, setSelectedApplication] = useState<TutorApplication | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch all tutor applications
  const { data: applications, isLoading } = useQuery({
    queryKey: ['tutor-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tutor_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TutorApplication[];
    },
  });

  // Mutation to update application status
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ 
      applicationId, 
      userId, 
      status, 
      notes 
    }: { 
      applicationId: string; 
      userId: string; 
      status: 'approved' | 'rejected'; 
      notes: string;
    }) => {
      // Update application status
      const { error: appError } = await supabase
        .from('tutor_applications')
        .update({
          status,
          admin_notes: notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', applicationId);

      if (appError) throw appError;

      // If approved, update user role to tutor
      if (status === 'approved') {
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: 'tutor' })
          .eq('user_id', userId);

        if (roleError) throw roleError;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tutor-applications'] });
      toast({
        title: variables.status === 'approved' ? 'Application Approved' : 'Application Rejected',
        description: `The tutor application has been ${variables.status}.`,
      });
      setReviewDialogOpen(false);
      setSelectedApplication(null);
      setAdminNotes('');
      setReviewAction(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update application.',
        variant: 'destructive',
      });
    },
  });

  const handleReview = (application: TutorApplication, action: 'approve' | 'reject') => {
    setSelectedApplication(application);
    setReviewAction(action);
    setAdminNotes(application.admin_notes || '');
    setReviewDialogOpen(true);
  };

  const handleConfirmReview = () => {
    if (!selectedApplication || !reviewAction) return;

    updateApplicationMutation.mutate({
      applicationId: selectedApplication.id,
      userId: selectedApplication.user_id,
      status: reviewAction === 'approve' ? 'approved' : 'rejected',
      notes: adminNotes,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingApplications = applications?.filter(app => app.status === 'pending') || [];
  const reviewedApplications = applications?.filter(app => app.status !== 'pending') || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tutor Applications</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve tutor applications
        </p>
      </div>

      {/* Pending Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Applications ({pendingApplications.length})</CardTitle>
          <CardDescription>Applications waiting for review</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingApplications.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No pending applications
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.full_name}</TableCell>
                    <TableCell>{application.email}</TableCell>
                    <TableCell>{application.experience_years} years</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {application.expertise.slice(0, 2).map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {application.expertise.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{application.expertise.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(application.created_at), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleReview(application, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReview(application, 'reject')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Reviewed Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Reviewed Applications ({reviewedApplications.length})</CardTitle>
          <CardDescription>Previously reviewed applications</CardDescription>
        </CardHeader>
        <CardContent>
          {reviewedApplications.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No reviewed applications yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewedApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.full_name}</TableCell>
                    <TableCell>{application.email}</TableCell>
                    <TableCell>{application.experience_years} years</TableCell>
                    <TableCell>{format(new Date(application.created_at), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {application.admin_notes || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve Application' : 'Reject Application'}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve'
                ? 'This will grant tutor privileges to the applicant.'
                : 'Provide a reason for rejection.'}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Application Details</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Name:</strong> {selectedApplication.full_name}</p>
                  <p><strong>Email:</strong> {selectedApplication.email}</p>
                  <p><strong>Experience:</strong> {selectedApplication.experience_years} years</p>
                  <p><strong>Education:</strong> {selectedApplication.education}</p>
                  <p><strong>Bio:</strong> {selectedApplication.bio}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-notes">Admin Notes</Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this decision..."
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              disabled={updateApplicationMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmReview}
              disabled={updateApplicationMutation.isPending}
              variant={reviewAction === 'approve' ? 'default' : 'destructive'}
            >
              {updateApplicationMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {reviewAction === 'approve' ? 'Approve' : 'Reject'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorApplications;
