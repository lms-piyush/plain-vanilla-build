
import React from 'react';
import { BookOpen, Calendar, Users, DollarSign, MessageSquare, Star } from 'lucide-react';

interface StatsGridProps {
  totalClasses: number;
  activeClasses: number;
  todaysSessionsCount: number;
}

const StatsGrid = ({ totalClasses, activeClasses, todaysSessionsCount }: StatsGridProps) => {
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
  );
};

export default StatsGrid;
