
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Star, MapPin, User, Calendar, Clock, Video } from "lucide-react";

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const today = new Date();
  
  // In a real app, this would come from an API call
  const classData = {
    id,
    title: "Introduction to Python Programming",
    tutor: {
      name: "Dr. Smith",
      tutorId: "tutor1",
      qualifications: "Ph.D in Computer Science",
      totalCourses: 8,
      totalStudents: 1240,
    },
    type: "Online", // Online or Offline
    format: "Live", // Live, Recorded, Inbound, Outbound
    duration: "Finite", // Finite or Infinite
    price: "₹5,000",
    isSubscription: false, // true for monthly subscription
    enrolled: 34,
    maxStudents: 40,
    classSize: "Group", // Group or 1-on-1
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800",
    overview: "This course introduces students to the Python programming language and its fundamental concepts. Students will learn about variables, data types, control structures, functions, and basic object-oriented programming principles.",
    lessons: [
      {
        title: "Introduction and Setup",
        description: "Overview of Python and setting up the development environment.",
        resources: ["Setup Guide.pdf", "Introduction Slides.ppt"],
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3), // Past class
        time: "18:00 - 19:30",
        video: id === "course3" ? "https://www.example.com/recorded-video" : null,
      },
      {
        title: "Variables and Data Types",
        description: "Understanding Python variables, strings, numbers, and lists.",
        resources: ["Variables Cheatsheet.pdf", "Practice Problems.py"],
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate()), // Today
        time: "18:00 - 19:30",
        video: id === "course3" ? "https://www.example.com/recorded-video" : null,
      },
      {
        title: "Control Structures",
        description: "If statements, loops, and conditional expressions.",
        resources: ["Control Flow Diagram.png", "Examples.py"],
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5), // Future class
        time: "18:00 - 19:30",
        video: id === "course3" ? "https://www.example.com/recorded-video" : null,
      },
      {
        title: "Functions and Modules",
        description: "Creating and using functions, importing modules.",
        resources: ["Function Reference.pdf", "Module Examples.zip"],
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10), // Future class
        time: "18:00 - 19:30",
        video: id === "course3" ? "https://www.example.com/recorded-video" : null,
      },
      {
        title: "Introduction to Object-Oriented Programming",
        description: "Classes, objects, inheritance, and polymorphism.",
        resources: ["OOP Concepts.pdf", "Class Examples.py"],
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15), // Future class
        time: "18:00 - 19:30",
        video: id === "course3" ? "https://www.example.com/recorded-video" : null,
      },
    ],
    rating: 4.8,
    reviews: 128,
    address: id === "course5" ? "123 Learning St, New York, NY" : undefined,
  };

  const handlePurchase = () => {
    navigate(`/checkout/${id}`);
  };
  
  const handleJoinClass = (lessonIndex: number) => {
    toast({
      title: "Joining class",
      description: `You're now joining ${classData.lessons[lessonIndex].title}`,
    });
    // In a real app, this would navigate to a video conference page
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  const isPast = (date: Date) => {
    const today = new Date();
    return date < today && !isToday(date);
  };
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Helper to render lesson layout based on class type
  const renderLessonLayout = (lesson: any, index: number) => {
    // Case 1: Online - Live - Finite
    if (classData.type === "Online" && classData.format === "Live" && classData.duration === "Finite") {
      return (
        <Card key={index} className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {index + 1}. {lesson.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {lesson.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm mb-3">
              <Calendar className="h-4 w-4 text-[#8A5BB7]" />
              <span>{formatDate(lesson.date)}</span>
              <Clock className="h-4 w-4 text-[#8A5BB7] ml-3" />
              <span>{lesson.time}</span>
            </div>
            
            {lesson.resources?.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Resources</h4>
                <div className="flex flex-wrap gap-2">
                  {lesson.resources.map((resource: string, idx: number) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {resource}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {isToday(lesson.date) && (
              <Button 
                className="w-full bg-[#8A5BB7] hover:bg-[#8A5BB7]/90 mt-2"
                onClick={() => handleJoinClass(index)}
              >
                Join Class Now
              </Button>
            )}
            
            {!isPast(lesson.date) && !isToday(lesson.date) && (
              <Button 
                disabled
                className="w-full mt-2"
              >
                Class Starts on {formatDate(lesson.date)}
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }
    
    // Case 2: Online - Live - Infinite
    if (classData.type === "Online" && classData.format === "Live" && classData.duration === "Infinite") {
      return (
        <Card key={index} className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {index + 1}. {lesson.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {lesson.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm mb-3">
              <Calendar className="h-4 w-4 text-[#8A5BB7]" />
              <span>{formatDate(lesson.date)}</span>
              <Clock className="h-4 w-4 text-[#8A5BB7] ml-3" />
              <span>{lesson.time}</span>
            </div>
            
            {lesson.resources?.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Resources</h4>
                <div className="flex flex-wrap gap-2">
                  {lesson.resources.map((resource: string, idx: number) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {resource}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {isToday(lesson.date) && (
              <Button 
                className="w-full bg-[#8A5BB7] hover:bg-[#8A5BB7]/90 mt-2"
                onClick={() => handleJoinClass(index)}
              >
                Join Class Now
              </Button>
            )}
            
            {!isPast(lesson.date) && !isToday(lesson.date) && (
              <Button 
                disabled
                className="w-full mt-2"
              >
                Class Starts on {formatDate(lesson.date)}
              </Button>
            )}
            
            <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
              This is an infinite-duration class. The tutor will conduct the next live session on Monday.
            </div>
          </CardContent>
        </Card>
      );
    }
    
    // Case 3: Online - Recorded - Finite
    if (classData.type === "Online" && classData.format === "Recorded" && classData.duration === "Finite") {
      return (
        <Card key={index} className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {index + 1}. {lesson.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {lesson.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="relative aspect-video bg-slate-100 rounded-md flex items-center justify-center mb-4">
              <Video className="h-10 w-10 text-slate-400" />
              <Button 
                className="absolute inset-0 flex items-center justify-center bg-transparent hover:bg-black/10"
              >
                Watch Video
              </Button>
            </div>
            
            {lesson.resources?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Resources</h4>
                <div className="flex flex-wrap gap-2">
                  {lesson.resources.map((resource: string, idx: number) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {resource}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }
    
    // Case 4: Online - Recorded - Infinite
    if (classData.type === "Online" && classData.format === "Recorded" && classData.duration === "Infinite") {
      return (
        <Card key={index} className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {index + 1}. {lesson.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {lesson.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="relative aspect-video bg-slate-100 rounded-md flex items-center justify-center mb-4">
              <Video className="h-10 w-10 text-slate-400" />
              <Button 
                className="absolute inset-0 flex items-center justify-center bg-transparent hover:bg-black/10"
              >
                Watch Video
              </Button>
            </div>
            
            {lesson.resources?.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Resources</h4>
                <div className="flex flex-wrap gap-2">
                  {lesson.resources.map((resource: string, idx: number) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {resource}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
              New content will be uploaded by the tutor on Monday.
            </div>
          </CardContent>
        </Card>
      );
    }
    
    // Case 5: Offline - Inbound - Finite/Infinite
    if (classData.type === "Offline" && classData.format === "Inbound") {
      return (
        <Card key={index} className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {index + 1}. {lesson.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {lesson.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm mb-3">
              <Calendar className="h-4 w-4 text-[#8A5BB7]" />
              <span>{formatDate(lesson.date)}</span>
              <Clock className="h-4 w-4 text-[#8A5BB7] ml-3" />
              <span>{lesson.time}</span>
            </div>
            
            {classData.address && (
              <div className="flex items-start gap-2 text-sm mb-3">
                <MapPin className="h-4 w-4 text-[#8A5BB7] mt-0.5" />
                <span>{classData.address}</span>
              </div>
            )}
            
            {lesson.resources?.length > 0 && (
              <div className="mb-2">
                <h4 className="text-sm font-medium mb-2">Resources</h4>
                <div className="flex flex-wrap gap-2">
                  {lesson.resources.map((resource: string, idx: number) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {resource}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }
    
    // Case 6: Offline - Outbound - Finite/Infinite
    if (classData.type === "Offline" && classData.format === "Outbound") {
      return (
        <Card key={index} className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {index + 1}. {lesson.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {lesson.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm mb-3">
              <Calendar className="h-4 w-4 text-[#8A5BB7]" />
              <span>{formatDate(lesson.date)}</span>
              <Clock className="h-4 w-4 text-[#8A5BB7] ml-3" />
              <span>{lesson.time}</span>
            </div>
            
            <div className="flex items-start gap-2 text-sm mb-3 bg-purple-50 p-3 rounded-md">
              <MapPin className="h-4 w-4 text-[#8A5BB7] mt-0.5" />
              <span>The tutor will visit your location for this class.</span>
            </div>
            
            {lesson.resources?.length > 0 && (
              <div className="mb-2">
                <h4 className="text-sm font-medium mb-2">Resources</h4>
                <div className="flex flex-wrap gap-2">
                  {lesson.resources.map((resource: string, idx: number) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      {resource}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }
    
    return null;
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mb-4"
        >
          Back
        </Button>
      </div>
      
      {/* Course Header Section - Using reference design from screenshot */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
        <div className="relative aspect-video">
          <img
            src={classData.image}
            alt={classData.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6">
          {/* Course Title */}
          <h1 className="text-2xl font-bold mb-4">{classData.title}</h1>
          
          {/* Course Info Bar */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4">
            {/* Tutor */}
            <button 
              className="text-base font-medium text-[#8A5BB7] hover:underline flex items-center"
              onClick={() => navigate(`/tutor/${classData.tutor.tutorId}`)}
            >
              <User className="mr-1 h-4 w-4" />
              {classData.tutor.name}
            </button>
            
            {/* Rating */}
            <div className="flex items-center">
              <Star className="fill-yellow-400 stroke-yellow-400 h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{classData.rating}</span>
              <span className="text-sm text-gray-500 ml-1">({classData.reviews} reviews)</span>
            </div>
            
            {/* Class Size */}
            <div className="text-sm">
              {classData.classSize === "Group" ? 
                `${classData.enrolled} students` : 
                <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">1-on-1</span>
              }
            </div>
          </div>
          
          {/* Course Overview */}
          <div className="text-gray-700 mb-6">
            {classData.overview}
          </div>
          
          {/* Course Attributes */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-2 py-1 rounded-full bg-[#E5D0FF] text-xs text-[#8A5BB7]">
              {classData.type}
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">
              {classData.format}
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">
              {classData.duration}
            </span>
          </div>
          
          {/* Price and Purchase Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
            <div>
              <span className="text-xl font-bold text-[#8A5BB7]">
                {classData.price}
                {classData.isSubscription && <span className="text-sm font-normal">/month</span>}
              </span>
            </div>
            <Button
              onClick={handlePurchase}
              className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
            >
              Purchase Course
            </Button>
          </div>
        </div>
      </div>
      
      {/* Course Content Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <Tabs defaultValue="lessons" className="w-full">
          <div className="px-6 pt-4 border-b">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="lessons" className="flex-1 sm:flex-none">Lessons</TabsTrigger>
              <TabsTrigger value="resources" className="flex-1 sm:flex-none">Resources</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1 sm:flex-none">Reviews</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="lessons" className="p-6">
            {classData.lessons.map((lesson, index) => renderLessonLayout(lesson, index))}
          </TabsContent>
          
          <TabsContent value="resources" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classData.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="space-y-3">
                  <h3 className="font-medium">
                    {lessonIndex + 1}. {lesson.title}
                  </h3>
                  {lesson.resources?.length > 0 && (
                    <div className="space-y-2">
                      {lesson.resources.map((resource, resourceIndex) => (
                        <Button
                          key={resourceIndex}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left"
                        >
                          {resource}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="p-6">
            <div className="text-center py-10 text-gray-500">
              <p>This course has {classData.reviews} reviews with an average rating of {classData.rating}.</p>
              <p className="mt-2">Purchase this course to see detailed reviews.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ClassDetail;
