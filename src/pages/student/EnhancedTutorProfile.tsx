import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Book, 
  Star, 
  Users, 
  Globe, 
  Clock,
  Plus,
  Edit
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { useTutorProfile } from '@/hooks/use-tutor-profile';
import { useTutorReviews } from '@/hooks/use-tutor-reviews';
import { useAllClassesWithReviews } from '@/hooks/use-all-classes-with-reviews';
import { useAuth } from '@/contexts/AuthContext';
import TutorReviewCard from '@/components/student/class-details/reviews-tab/TutorReviewCard';
import WriteReviewModal from '@/components/student/class-details/WriteReviewModal';
import CourseCard from '@/components/dashboard/CourseCard';

const EnhancedTutorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    profile, 
    statistics, 
    isLoading: profileLoading 
  } = useTutorProfile(id);
  
  const {
    reviews,
    reviewStats,
    isLoading: reviewsLoading,
    hasUserReviewed,
    userReview,
    isUserEligible,
    submitReview,
    refetch: refetchReviews
  } = useTutorReviews(id || "", 1, 5);

  const { data: classesData } = useAllClassesWithReviews();
  const tutorClasses = classesData?.classes?.filter(cls => cls.tutor_id === id) || [];

  const handleSubmitReview = async (rating: number, reviewText: string) => {
    setIsSubmitting(true);
    const success = await submitReview(rating, reviewText);
    setIsSubmitting(false);
    if (success) {
      setIsWriteReviewOpen(false);
      refetchReviews();
    }
    return success;
  };

  // Mock data for charts (in real app, this would come from analytics)
  const monthlyEngagement = [
    { month: 'Jan', students: 42 },
    { month: 'Feb', students: 48 },
    { month: 'Mar', students: 53 },
    { month: 'Apr', students: 57 },
    { month: 'May', students: 62 },
    { month: 'Jun', students: 58 }
  ];

  const ratings = [
    { month: 'Jan', onlineRating: 4.6, offlineRating: 4.5 },
    { month: 'Feb', onlineRating: 4.7, offlineRating: 4.6 },
    { month: 'Mar', onlineRating: 4.7, offlineRating: 4.6 },
    { month: 'Apr', onlineRating: 4.8, offlineRating: 4.7 },
    { month: 'May', onlineRating: 4.9, offlineRating: 4.8 },
    { month: 'Jun', onlineRating: 4.8, offlineRating: 4.7 }
  ];

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-6">
        <h1 className="text-2xl font-bold mb-4">Tutor Not Found</h1>
        <p className="mb-6">The tutor profile you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate(-1)} className="bg-primary hover:bg-primary/90">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <Avatar className="h-24 w-24 md:h-32 md:w-32">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback className="bg-primary text-white text-4xl">
            {profile.full_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold">{profile.full_name}</h1>
          <p className="text-lg text-muted-foreground">{profile.position}</p>
        </div>
      </div>
      
      {/* Basic Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>About the Tutor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{profile.bio}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Years of Experience</p>
                  <p className="text-muted-foreground">{profile.years_experience} years</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Languages Spoken</p>
                  <div className="flex gap-1">
                    {profile.languages_spoken?.map((lang, index) => (
                      <Badge key={index} variant="secondary">{lang}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Statistics Card */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-2xl font-bold">{statistics?.totalCourses || 0}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold mr-2">
                      {reviewStats?.averageRating ? reviewStats.averageRating.toFixed(1) : "0.0"}
                    </p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.round(reviewStats?.averageRating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{statistics?.totalStudents || 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Student Engagement</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rating Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ratings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[4, 5]} />
                <RechartsTooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="onlineRating" 
                  name="Online Classes"
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="offlineRating" 
                  name="Offline Classes"
                  stroke="#36A2EB" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Reviews Section */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Reviews & Ratings</CardTitle>
              {user && isUserEligible && (
                <Button 
                  onClick={() => setIsWriteReviewOpen(true)}
                  variant={hasUserReviewed ? "outline" : "default"}
                  size="sm"
                >
                  {hasUserReviewed ? (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Update Review
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Write Review
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Current User's Review */}
            {hasUserReviewed && userReview && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Your Review</h3>
                <TutorReviewCard review={userReview} />
              </div>
            )}
            
            {/* Review Statistics */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold">
                  {reviewStats?.averageRating ? reviewStats.averageRating.toFixed(1) : "0.0"}
                </span>
              </div>
              <span className="text-muted-foreground">
                Based on {reviewStats?.totalReviews || 0} reviews
              </span>
            </div>

            {/* Recent Reviews */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Reviews</h3>
              {reviewsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <TutorReviewCard key={review.id} review={review} />
                  ))}
                  {reviews.length > 3 && (
                    <p className="text-center text-muted-foreground text-sm">
                      Showing {Math.min(3, reviews.length)} of {reviews.length} reviews
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No reviews yet. Be the first to review this tutor!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Courses by this Tutor Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Courses by this Tutor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorClasses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              tutor={profile.full_name}
              tutorId={profile.id}
              rating={course.average_rating || 0}
              image={course.thumbnail_url}
              description={course.description}
              mode={course.delivery_mode}
              format={course.class_format}
              classSize={course.class_size}
              price={course.price ? `₹${course.price}` : 'Free'}
              onClick={() => navigate(`/student/classes/${course.id}`)}
              onTutorClick={() => {}}
            />
          ))}
        </div>
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteReviewOpen}
        onClose={() => setIsWriteReviewOpen(false)}
        onSubmit={handleSubmitReview}
        isSubmitting={isSubmitting}
        existingReview={userReview}
        isUpdate={hasUserReviewed}
      />
    </div>
  );
};

export default EnhancedTutorProfile;