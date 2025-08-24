
import React from 'react';
import { BookOpen, Calendar, Users, DollarSign, MessageSquare, Star } from 'lucide-react';
import { useTutorDashboardStats } from '@/hooks/use-tutor-dashboard-stats';

interface StatsGridProps {
  totalClasses?: number;
  activeClasses?: number;
  todaysSessionsCount?: number;
}

const StatsGrid = ({ totalClasses: propTotalClasses, activeClasses: propActiveClasses, todaysSessionsCount: propTodaysSessionsCount }: StatsGridProps) => {
  const { data: stats, isLoading } = useTutorDashboardStats();

  // Use real data if available, fallback to props, then to dummy data
  const totalClasses = stats?.totalClasses ?? propTotalClasses ?? 12;
  const activeClasses = propActiveClasses ?? Math.floor(totalClasses * 0.8);
  const todaysSessionsCount = stats?.todaysSessions ?? propTodaysSessionsCount ?? 3;
  const totalStudents = stats?.totalStudents ?? 156;
  const monthlyRevenue = stats?.monthlyRevenue ?? 15000;
  const unreadMessages = stats?.unreadMessages ?? 12;
  const averageRating = stats?.averageRating ?? 4.5;
  const totalReviews = stats?.totalReviews ?? 135;
  const studentGrowth = stats?.studentGrowth ?? 14;
  const revenueGrowth = stats?.previousMonthRevenue > 0 
    ? ((monthlyRevenue - stats.previousMonthRevenue) / stats.previousMonthRevenue * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="stats-card animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {/* Classes Card */}
      <div className="stats-card">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Classes</h3>
            <p className="text-2xl font-semibold mt-1">{totalClasses}</p>
            <p className="text-sm text-gray-500 mt-1">Total Classes</p>
            <p className="text-xs text-gray-500 mt-2">
              <span className="text-green-500">Active: {activeClasses}</span>
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
            <p className="text-2xl font-semibold mt-1">{todaysSessionsCount}</p>
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
            <p className="text-2xl font-semibold mt-1">{totalStudents}</p>
            <p className="text-sm text-gray-500 mt-1">Currently Enrolled</p>
            <p className="text-xs text-gray-500 mt-2">
              <span className={studentGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {studentGrowth >= 0 ? "+" : ""}{Math.round(studentGrowth)}%
              </span> from last month
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
            <p className="text-2xl font-semibold mt-1">₹{monthlyRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">This Month</p>
            <p className="text-xs text-gray-500 mt-2">
              <span className={revenueGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {revenueGrowth >= 0 ? "+" : ""}₹{Math.abs(monthlyRevenue - (stats?.previousMonthRevenue ?? 0)).toLocaleString()}
              </span> from last month
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
            <p className="text-2xl font-semibold mt-1">{unreadMessages}</p>
            <p className="text-sm text-gray-500 mt-1">From Students</p>
            <p className="text-xs text-gray-500 mt-2">
              {unreadMessages > 0 ? (
                <span className="text-orange-500">Needs attention</span>
              ) : (
                <span className="text-green-500">All caught up</span>
              )}
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
            <p className="text-2xl font-semibold mt-1">{averageRating}</p>
            <p className="text-sm text-gray-500 mt-1">From {totalReviews} Reviews</p>
            <p className="text-xs font-medium text-yellow-600 mt-2">
              {averageRating >= 4.5 ? "Excellent" : 
               averageRating >= 4.0 ? "Very Good" : 
               averageRating >= 3.5 ? "Good" : 
               averageRating >= 3.0 ? "Average" : "Needs Improvement"}
            </p>
          </div>
          <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
            <Star size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsGrid;
