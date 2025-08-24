
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Clock, 
  BookOpen, 
  Star 
} from "lucide-react";

import TutorDashboardLayout from "@/components/TutorDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SimpleCreateClassDialog from "@/components/tutor-dashboard/SimpleCreateClassDialog";
import { useTutorClasses } from "@/hooks/use-tutor-classes";
import { useTutorDashboardStats } from "@/hooks/use-tutor-dashboard-stats";

const TutorDashboard = () => {
  const [createClassDialogOpen, setCreateClassDialogOpen] = useState(false);
  const { refetch } = useTutorClasses();
  const { data: stats, isLoading: statsLoading } = useTutorDashboardStats();

  const handleCreateClass = () => {
    setCreateClassDialogOpen(true);
  };

  const handleClassCreated = () => {
    refetch();
  };

  return (
    <TutorDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1F4E79]">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your teaching overview.</p>
          </div>
          <Button 
            onClick={handleCreateClass} 
            className="bg-[#1F4E79] hover:bg-[#1a4369]"
          >
            <Plus className="mr-1 h-4 w-4" />
            Create New Class
          </Button>
        </div>

        {/* Create Class Dialog */}
        <SimpleCreateClassDialog
          open={createClassDialogOpen}
          onOpenChange={setCreateClassDialogOpen}
          onClassCreated={handleClassCreated}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsLoading ? (
            [...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalClasses || 0}</div>
                  <p className="text-xs text-muted-foreground">All classes created</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.studentGrowth ? 
                      `${stats.studentGrowth >= 0 ? '+' : ''}${Math.round(stats.studentGrowth)}% from last month` :
                      'Currently enrolled'
                    }
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(stats?.monthlyRevenue || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.previousMonthRevenue ? 
                      `${stats.monthlyRevenue >= stats.previousMonthRevenue ? '+' : ''}₹${Math.abs(stats.monthlyRevenue - stats.previousMonthRevenue).toLocaleString()} from last month` :
                      'This month'
                    }
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.averageRating || 0}</div>
                  <p className="text-xs text-muted-foreground">Based on {stats?.totalReviews || 0} reviews</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Recent Activity & Upcoming Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
              <CardDescription>Your next scheduled classes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="bg-[#1F4E79] text-white p-2 rounded">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Advanced Mathematics</h4>
                  <p className="text-sm text-muted-foreground">Today, 2:00 PM - 3:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="bg-[#8A5BB7] text-white p-2 rounded">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Physics Lab</h4>
                  <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM - 11:30 AM</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="bg-[#F29F05] text-white p-2 rounded">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Chemistry Basics</h4>
                  <p className="text-sm text-muted-foreground">Friday, 3:00 PM - 4:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest updates and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="bg-green-500 text-white p-2 rounded">
                  <Users className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">New Student Enrolled</h4>
                  <p className="text-sm text-muted-foreground">Sarah joined Advanced Mathematics</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="bg-blue-500 text-white p-2 rounded">
                  <Star className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">New Review Received</h4>
                  <p className="text-sm text-muted-foreground">5-star rating for Physics Lab</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="bg-orange-500 text-white p-2 rounded">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Revenue Milestone</h4>
                  <p className="text-sm text-muted-foreground">Reached $2,000 this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Manage your teaching activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" asChild className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link to="/tutor-dashboard/classes">
                  <BookOpen className="h-6 w-6" />
                  <span>Manage Classes</span>
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link to="/tutor-dashboard/messages">
                  <Users className="h-6 w-6" />
                  <span>View Messages</span>
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link to="/tutor-dashboard/earnings">
                  <DollarSign className="h-6 w-6" />
                  <span>Check Earnings</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TutorDashboardLayout>
  );
};

export default TutorDashboard;
