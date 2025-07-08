import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Camera, Clock, Globe, ArrowLeft, BookOpen, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTutorProfile } from "@/hooks/use-tutor-profile";
import { useTutorReviews } from "@/hooks/use-tutor-reviews";
import TutorReviewCard from "@/components/student/class-details/reviews-tab/TutorReviewCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from "react-router-dom";

const profileFormSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  position: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  years_experience: z.number().min(0).max(50).optional(),
  languages_spoken: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const TutorProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { 
    profile, 
    statistics, 
    isLoading, 
    updateProfile 
  } = useTutorProfile(user?.id);
  
  const {
    reviews,
    reviewStats,
    isLoading: reviewsLoading,
    currentPage: reviewCurrentPage,
    totalPages,
    goToPage,
  } = useTutorReviews(user?.id || "", 1, 10);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: {
      full_name: profile?.full_name || "",
      position: profile?.position || "",
      bio: profile?.bio || "",
      years_experience: profile?.years_experience || 0,
      languages_spoken: profile?.languages_spoken?.join(", ") || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const languages = data.languages_spoken 
        ? data.languages_spoken.split(",").map(lang => lang.trim()).filter(Boolean)
        : [];
      
      await updateProfile({
        ...data,
        languages_spoken: languages,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/tutor/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-primary/20">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                      <AvatarFallback className="text-4xl bg-primary text-white">
                        {profile?.full_name?.charAt(0) || user?.fullName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-foreground">
                          {profile?.full_name || user?.fullName}
                        </h1>
                        <p className="text-lg text-muted-foreground mt-1">
                          {profile?.position || "Tutor"}
                        </p>
                      </div>
                      {!isEditing && (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About the Tutor</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., PhD in Physics, MIT" 
                              {...field} 
                              disabled={!isEditing} 
                            />
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
                          <FormLabel>About</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell students about your background, expertise, and teaching approach..." 
                              {...field} 
                              disabled={!isEditing}
                              className="min-h-32" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="years_experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Years of Experience
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                disabled={!isEditing} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="languages_spoken"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Languages Spoken
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="English, Spanish, French" 
                                {...field} 
                                disabled={!isEditing} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    )}
                  </form>
                </Form>

                {!isEditing && profile?.bio && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-foreground leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                {!isEditing && (
                  <div className="mt-6 flex flex-wrap gap-4">
                    {profile?.years_experience && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Years of Experience</span>
                        <span className="font-medium">{profile.years_experience} years</span>
                      </div>
                    )}
                    {profile?.languages_spoken && profile.languages_spoken.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Languages Spoken</span>
                        <div className="flex gap-1">
                          {profile.languages_spoken.map((lang, index) => (
                            <Badge key={index} variant="secondary">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>
                  What students say about my teaching
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No reviews yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <TutorReviewCard key={review.id} review={review} />
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="pt-6">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => handlePageChange(reviewCurrentPage - 1)}
                                className={reviewCurrentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                            
                            {[...Array(totalPages)].map((_, index) => {
                              const page = index + 1;
                              return (
                                <PaginationItem key={page}>
                                  <PaginationLink
                                    onClick={() => handlePageChange(page)}
                                    isActive={reviewCurrentPage === page}
                                    className="cursor-pointer"
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}
                            
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => handlePageChange(reviewCurrentPage + 1)}
                                className={reviewCurrentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Statistics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Total Courses */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Courses</p>
                    <p className="text-2xl font-bold">{statistics?.totalCourses || 0}</p>
                  </div>
                </div>

                {/* Average Rating */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">
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

                {/* Total Students */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold">{statistics?.totalStudents || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;