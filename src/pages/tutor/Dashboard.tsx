
import React, { useState } from 'react';
import { Plus, ArrowRight, BookOpen, Calendar, Users, DollarSign, MessageSquare, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Bar, BarChart } from 'recharts';
import SimpleCreateClassDialog from '@/components/tutor-dashboard/SimpleCreateClassDialog';
import { useTutorClasses } from '@/hooks/use-tutor-classes';

const Dashboard = () => {
  const [createClassDialogOpen, setCreateClassDialogOpen] = useState(false);
  const [sessionFilter, setSessionFilter] = useState<'today' | 'all'>('today');
  const { classes, refetch } = useTutorClasses();

  const handleCreateClass = () => {
    setCreateClassDialogOpen(true);
  };

  const handleClassCreated = () => {
    refetch();
  };

  // Mock data for the chart
  const teachingProgressData = [
    { month: 'Jun', teachingHours: 45, students: 52 },
    { month: 'Jul', teachingHours: 60, students: 45 },
    { month: 'Aug', teachingHours: 65, students: 58 },
    { month: 'Sep', teachingHours: 70, students: 75 },
    { month: 'Oct', teachingHours: 90, students: 100 },
    { month: 'Nov', teachingHours: 110, students: 105 },
    { month: 'Dec', teachingHours: 95, students: 100 },
    { month: 'Jan', teachingHours: 100, students: 120 },
    { month: 'Feb', teachingHours: 120, students: 135 },
    { month: 'Mar', teachingHours: 135, students: 140 },
    { month: 'Apr', teachingHours: 150, students: 180 },
    { month: 'May', teachingHours: 115, students: 190 },
  ];
  
  // Get today's date for filtering
  const today = new Date();
  const todayDateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Filter classes based on the session filter and check schedule dates
  const getFilteredClasses = () => {
    if (sessionFilter === 'today') {
      return classes.filter(classItem => {
        // Check if any schedule includes today's date
        if (classItem.class_schedules && classItem.class_schedules.length > 0) {
          return classItem.class_schedules.some(schedule => {
            const startDate = schedule.start_date ? new Date(schedule.start_date) : null;
            
            if (startDate) {
              // Check if today matches the start date
              return startDate.toISOString().split('T')[0] === todayDateString;
            }
            return false;
          });
        }
        return false;
      });
    }
    return classes;
  };

  const filteredClasses = getFilteredClasses();

  // Count today's sessions based on schedule dates
  const getTodaysSessionsCount = () => {
    return classes.filter(classItem => {
      if (classItem.class_schedules && classItem.class_schedules.length > 0) {
        return classItem.class_schedules.some(schedule => {
          const startDate = schedule.start_date ? new Date(schedule.start_date) : null;
          
          if (startDate) {
            return startDate.toISOString().split('T')[0] === todayDateString;
          }
          return false;
        });
      }
      return false;
    }).length;
  };

  const formatClassTimeInfo = (classItem: any) => {
    // Schedule information
    let scheduleInfo = 'Not scheduled';
    if (classItem.class_schedules && classItem.class_schedules.length > 0) {
      const schedule = classItem.class_schedules[0];
      const startDate = schedule.start_date ? new Date(schedule.start_date).toLocaleDateString() : null;
      
      if (sessionFilter === 'today') {
        scheduleInfo = startDate ? `Scheduled: ${startDate}` : 'Not scheduled';
      } else {
        scheduleInfo = startDate ? `Starts: ${startDate}` : 'Not scheduled';
      }
    }

    // Time slot information  
    let timeInfo = 'Time not set';
    if (classItem.class_time_slots && classItem.class_time_slots.length > 0) {
      const timeSlot = classItem.class_time_slots[0];
      const startTime = timeSlot.start_time;
      const endTime = timeSlot.end_time;
      
      // Format time from "HH:MM:SS" to "HH:MM AM/PM"
      const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const hour12 = parseInt(hours) % 12 || 12;
        const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
        return `${hour12}:${minutes} ${ampm}`;
      };

      timeInfo = `${formatTime(startTime)} - ${formatTime(endTime)}`;
    }

    return {
      date: scheduleInfo,
      time: timeInfo
    };
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="bg-primary/10 rounded-lg p-6 mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Good Evening, Tutor!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your teaching journey.</p>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <button 
            onClick={handleCreateClass}
            className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Create New Class
          </button>
        </div>
      </div>
      
      {/* Create Class Dialog */}
      <SimpleCreateClassDialog
        open={createClassDialogOpen}
        onOpenChange={setCreateClassDialogOpen}
        onClassCreated={handleClassCreated}
      />
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Classes Card */}
        <div className="stats-card">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Classes</h3>
              <p className="text-2xl font-semibold mt-1">{classes.length}</p>
              <p className="text-sm text-gray-500 mt-1">Total Classes</p>
              <p className="text-xs text-gray-500 mt-2">
                <span className="text-green-500">Active: {classes.filter(c => c.status === 'active').length}</span>
              </p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <BookOpen size={20} />
            </div>
          </div>
        </div>
        
        {/* Today's Sessions */}
        <div className="stats-card">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Today's Sessions</h3>
              <p className="text-2xl font-semibold mt-1">{getTodaysSessionsCount()}</p>
              <p className="text-sm text-gray-500 mt-1">Scheduled for today</p>
              <p className="text-xs text-gray-500 mt-2">
                <span className="text-green-500">Live Classes</span>
              </p>
            </div>
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Calendar size={20} />
            </div>
          </div>
        </div>
        
        {/* Total Students */}
        <div className="stats-card">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
              <p className="text-2xl font-semibold mt-1">156</p>
              <p className="text-sm text-gray-500 mt-1">Currently Enrolled</p>
              <p className="text-xs text-gray-500 mt-2">
                <span className="text-green-500">+14%</span> from last month
              </p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
              <Users size={20} />
            </div>
          </div>
        </div>
        
        {/* Monthly Revenue */}
        <div className="stats-card">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Monthly Revenue</h3>
              <p className="text-2xl font-semibold mt-1">₹15,000</p>
              <p className="text-sm text-gray-500 mt-1">This Month</p>
              <p className="text-xs text-gray-500 mt-2">
                <span className="text-green-500">+₹5,000</span> from last month
              </p>
            </div>
            <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
              <DollarSign size={20} />
            </div>
          </div>
        </div>
        
        {/* Unread Messages */}
        <div className="stats-card">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Unread Messages</h3>
              <p className="text-2xl font-semibold mt-1">12</p>
              <p className="text-sm text-gray-500 mt-1">From Students</p>
              <p className="text-xs text-gray-500 mt-2">
                <span className="text-green-500">+1</span> from yesterday
              </p>
            </div>
            <div className="h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
              <MessageSquare size={20} />
            </div>
          </div>
        </div>
        
        {/* Average Ratings */}
        <div className="stats-card">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Average Ratings</h3>
              <p className="text-2xl font-semibold mt-1">4.5</p>
              <p className="text-sm text-gray-500 mt-1">From 135 Reviews</p>
              <p className="text-xs font-medium text-yellow-600 mt-2">
                Excellent
              </p>
            </div>
            <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
              <Star size={20} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart Section */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold mb-4">Teaching Progress</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={teachingProgressData}
              margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="teachingHours" name="Teaching Hours" fill="#8A5BB7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="students" name="Students" fill="#BA8DF1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Sessions Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Sessions</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setSessionFilter('today')}
              className={`text-sm px-4 py-2 rounded-md transition-colors ${
                sessionFilter === 'today' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Today's Sessions ({getTodaysSessionsCount()})
            </button>
            <button 
              onClick={() => setSessionFilter('all')}
              className={`text-sm px-4 py-2 rounded-md transition-colors ${
                sessionFilter === 'all' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              All Sessions ({classes.length})
            </button>
          </div>
        </div>
        
        <div className="flex justify-between flex-wrap">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
            {filteredClasses.length > 0 ? (
              filteredClasses.map(classItem => {
                const timeInfo = formatClassTimeInfo(classItem);
                return (
                  <div key={classItem.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-medium text-gray-800">{classItem.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{classItem.description || "No description available"}</p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="mr-2 text-gray-500" />
                        <span>{timeInfo.date}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="mr-2 text-gray-500" />
                        <span>{timeInfo.time}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Users size={16} className="mr-2 text-gray-500" />
                        <span>{classItem.class_size === 'one-on-one' ? '1 student' : (classItem.max_students ? `Max ${classItem.max_students} students` : 'No limit')}</span>
                      </div>
                    </div>
                    
                    <div className="mt-5 flex items-center justify-between">
                      <button className="bg-primary text-white px-4 py-2 rounded-md text-sm">
                        Start Session
                      </button>
                      <button className="p-2 rounded-md hover:bg-gray-100">
                        <ArrowRight size={18} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500">
                  {sessionFilter === 'today' 
                    ? 'No classes scheduled for today' 
                    : 'No classes found'}
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-6 w-full lg:mt-0 lg:w-auto lg:ml-6 flex justify-center">
            <button 
              onClick={handleCreateClass}
              className="inline-flex items-center justify-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Create new Class
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
