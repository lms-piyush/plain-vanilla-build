import React from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/dashboard/StatCard";
import CourseDistributionChart from "@/components/dashboard/CourseDistributionChart";
import CourseCard from "@/components/dashboard/CourseCard";
import ClassesTable from "@/components/dashboard/ClassesTable";
import { Button } from "@/components/ui/button";
import { Calendar, Book, Star, BookOpen } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNewCourses } from "@/hooks/use-new-courses";
import { useStudentTodayClasses } from "@/hooks/use-student-today-classes";
import { useStudentEnrollmentStats } from "@/hooks/use-student-enrollment-stats";
import { useStudentSavedClassesStats } from "@/hooks/use-student-saved-classes-stats";
import { useStudentCourseDistribution } from "@/hooks/use-student-course-distribution";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: newCourses = [], isLoading: isNewCoursesLoading } = useNewCourses();
  const { data: todayClasses = [], isLoading: isTodayClassesLoading } = useStudentTodayClasses();
  const { data: enrollmentStats = { totalEnrolled: 0 }, isLoading: isEnrollmentStatsLoading } = useStudentEnrollmentStats();
  const { data: savedClassesStats = { totalSaved: 0 }, isLoading: isSavedStatsLoading } = useStudentSavedClassesStats();
  const { data: courseDistribution = { notStarted: 0, ongoing: 0, completed: 0 }, isLoading: isDistributionLoading } = useStudentCourseDistribution();

  // Calculate stats from real data
  const stats = [
    {
      title: "Today's Classes",
      value: isTodayClassesLoading ? 0 : todayClasses.length,
      icon: <Calendar className="h-5 w-5" />,
      delta: { value: 0, isPositive: true },
      onClick: () => {
        // Scroll to today's classes section
        document.getElementById("todaysClasses")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      title: "My Classes",
      value: isEnrollmentStatsLoading ? 0 : enrollmentStats.totalEnrolled,
      icon: <Book className="h-5 w-5" />,
      delta: { value: 0, isPositive: true },
      onClick: () => navigate("/student/my-classes")
    },
    {
      title: "Saved Classes",
      value: isSavedStatsLoading ? 0 : savedClassesStats.totalSaved,
      icon: <Star className="h-5 w-5" />,
      delta: { value: 0, isPositive: true },
      onClick: () => navigate("/student/explore?tab=saved")
    }
  ];

  // Real data for chart from database
  const chartData = isDistributionLoading ? [] : [
    { name: "Completed", value: courseDistribution.completed, color: "#8A5BB7" },
    { name: "Ongoing", value: courseDistribution.ongoing, color: "#BA8DF1" },
    { name: "Not Started", value: courseDistribution.notStarted, color: "#E5D0FF" }
  ];

  // Calculate total courses for chart center
  const totalCourses = isDistributionLoading ? 0 : chartData.reduce((sum, item) => sum + item.value, 0);


  // Filter out completed classes for display
  const ongoingTodaysClasses = todayClasses.filter(cls => cls.status !== "Completed");

  const handleStartSession = (classId: string) => {
    // In a real app, this would navigate to the class session
    toast({
      title: "Starting class session",
      description: `Redirecting to class with ID: ${classId}`,
    });
    // navigate(`/classes/${classId}`);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            delta={stat.delta}
            onClick={stat.onClick}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Course Distribution Chart */}
        <CourseDistributionChart data={chartData} totalCourses={totalCourses} />
        
        {/* New Courses Section (renamed from Popular Courses) */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">New Courses</h2>
            <Button 
              variant="outline" 
              className="text-[#8A5BB7] border-[#8A5BB7]"
              onClick={() => navigate("/student/explore")}
            >
              View All Courses
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
            {isNewCoursesLoading ? (
              // Loading skeleton
              [...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
              ))
            ) : (
              newCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  tutor={course.tutor_name}
                  rating={course.average_rating}
                  image={course.thumbnail_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300"}
                  onClick={() => navigate(`/student/classes/${course.id}`)}
                />
              ))
            )}
          </div>

          <div className="mt-auto">
            <Button 
              variant="outline" 
              className="w-full mt-4 text-[#8A5BB7] border-[#8A5BB7] md:hidden"
              onClick={() => navigate("/student/explore")}
            >
              View All Courses
            </Button>
          </div>
        </div>
      </div>
      
      {/* Today's Classes Table - Updated to show empty state when no classes */}
      <div id="todaysClasses" className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Today's Classes</h2>
        
        {isTodayClassesLoading ? (
          <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-4 rounded mb-4"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        ) : ongoingTodaysClasses.length > 0 ? (
          <ClassesTable 
            classes={ongoingTodaysClasses} 
            onStartSession={handleStartSession}
          />
        ) : (
          <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <BookOpen className="h-12 w-12 text-[#8A5BB7] mb-4" />
              <p className="text-lg font-medium mb-2">No classes scheduled for today.</p>
              <p className="text-gray-500">Enjoy your day or explore new courses!</p>
              <Button 
                className="mt-6 bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
                onClick={() => navigate("/student/explore")}
              >
                Explore Courses
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
