import React from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/dashboard/StatCard";
import CourseDistributionChart from "@/components/dashboard/CourseDistributionChart";
import CourseCard from "@/components/dashboard/CourseCard";
import ClassesTable from "@/components/dashboard/ClassesTable";
import { Button } from "@/components/ui/button";
import { Calendar, Book, Star, BookOpen } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();

  // Sample data for stats
  const stats = [
    {
      title: "Today's Classes",
      value: 2,
      icon: <Calendar className="h-5 w-5" />,
      delta: { value: 50, isPositive: true },
      onClick: () => {
        // Scroll to today's classes section
        document.getElementById("todaysClasses")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      title: "My Classes",
      value: 12,
      icon: <Book className="h-5 w-5" />,
      delta: { value: 10, isPositive: true },
      onClick: () => navigate("/my-classes")
    },
    {
      title: "Saved Classes",
      value: 5,
      icon: <Star className="h-5 w-5" />,
      delta: { value: 0, isPositive: true },
      onClick: () => navigate("/explore?filter=saved")
    }
  ];

  // Sample data for chart
  const chartData = [
    { name: "Completed", value: 8, color: "#8A5BB7" },
    { name: "Ongoing", value: 4, color: "#BA8DF1" },
    { name: "Not Started", value: 6, color: "#E5D0FF" }
  ];

  // Calculate total courses for chart center
  const totalCourses = chartData.reduce((sum, item) => sum + item.value, 0);

  // Sample data for new courses (limited to 3)
  const newCourses = [
    {
      id: "course1",
      title: "Introduction to Python",
      tutor: "Dr. Smith",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300"
    },
    {
      id: "course2",
      title: "Advanced Mathematics",
      tutor: "Prof. Johnson",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=300"
    },
    {
      id: "course3",
      title: "Web Development",
      tutor: "Sarah Lee",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300"
    }
  ];

  // Sample data for today's classes - UPDATED to only show non-completed classes for today
  const todaysClasses = [
    {
      id: "class1",
      name: "Calculus",
      type: "Online" as const,
      status: "Ongoing" as const,
      format: "Live" as const,
      time: "10:00 AM - 11:30 AM",
      isStartable: true
    },
    {
      id: "class3",
      name: "Chemistry Lab",
      type: "Offline" as const,
      status: "Ongoing" as const,
      format: "Inbound" as const,
      time: "02:00 PM - 04:00 PM",
      isStartable: false
    }
  ];

  // Filter out completed classes - fixed type comparison
  const ongoingTodaysClasses = todaysClasses.filter(cls => cls.status === "Ongoing");

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
              onClick={() => navigate("/explore?filter=new")}
            >
              View All Courses
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
            {newCourses.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                onClick={() => navigate(`/classes/${course.id}`)}
              />
            ))}
          </div>

          <div className="mt-auto">
            <Button 
              variant="outline" 
              className="w-full mt-4 text-[#8A5BB7] border-[#8A5BB7] md:hidden"
              onClick={() => navigate("/explore?filter=new")}
            >
              View All Courses
            </Button>
          </div>
        </div>
      </div>
      
      {/* Today's Classes Table - Updated to show empty state when no classes */}
      <div id="todaysClasses" className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Today's Classes</h2>
        
        {ongoingTodaysClasses.length > 0 ? (
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
                onClick={() => navigate("/explore")}
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
