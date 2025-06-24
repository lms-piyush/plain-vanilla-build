
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, Star, DollarSign, Edit, Trash2, Clock, User } from 'lucide-react';
import { useTutorClasses } from '@/hooks/use-tutor-classes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

const ManageClass = () => {
  const { id } = useParams<{ id: string }>();
  const { classes, isLoading, refetch } = useTutorClasses();
  
  const classData = classes.find(c => c.id === id);

  const handleEdit = () => {
    toast.info('Edit functionality will be implemented');
  };

  const handleDelete = async () => {
    if (!classData) return;
    
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classData.id);

      if (error) {
        toast.error(`Failed to delete class: ${error.message}`);
        return;
      }

      toast.success(`Class "${classData.title}" has been deleted successfully`);
      // Navigate back after deletion
      window.history.back();
    } catch (err: any) {
      toast.error('An unexpected error occurred while deleting the class');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading class details...</p>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-500">Class not found</p>
          <Link to="/tutor/classes" className="text-primary hover:underline mt-2 inline-block">
            Back to Classes
          </Link>
        </div>
      </div>
    );
  }

  // Mock data for demonstration - replace with real data when available
  const mockData = {
    studentCount: 12,
    sessionCount: 8,
    rating: 4.7,
    earnings: 960,
    completionProgress: 65,
    nextSession: {
      title: "Functions and Modules",
      date: "June 15, 2023",
      time: "4:00 PM - 5:30 PM",
      student: "Alex Johnson"
    }
  };

  return (
    <div className="p-6">
      {/* Header with Back Button */}
      <div className="mb-6">
        <Link 
          to="/tutor/classes" 
          className="inline-flex items-center text-primary hover:text-primary/80 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Classes
        </Link>
      </div>

      {/* Class Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 bg-gradient-to-br from-[#1F4E79] to-[#8A5BB7] rounded-lg flex-shrink-0">
            {classData.thumbnail_url ? (
              <img 
                src={classData.thumbnail_url} 
                alt={classData.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                {classData.title.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#1F4E79] mb-2">{classData.title}</h1>
                <p className="text-gray-600 mb-4">{classData.description || "No description available"}</p>
                <div className="flex items-center gap-4">
                  <Badge className={
                    classData.status === 'active' ? 'bg-green-100 text-green-800' :
                    classData.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {classData.status}
                  </Badge>
                  <Badge variant="outline">{classData.delivery_mode}</Badge>
                  <Badge variant="outline">{classData.class_size}</Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Class
                </Button>
                <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Section - Class Overview (9 columns) */}
        <div className="col-span-9">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Class Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{mockData.studentCount}</div>
                  <div className="text-sm text-gray-500">Students</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{mockData.sessionCount}</div>
                  <div className="text-sm text-gray-500">Sessions</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-2">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{mockData.rating}</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">₹{mockData.earnings}</div>
                  <div className="text-sm text-gray-500">Earnings</div>
                </div>
              </div>
              
              {/* Course Completion Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Course Completion</h3>
                  <span className="text-sm text-gray-500">{mockData.completionProgress}%</span>
                </div>
                <Progress value={mockData.completionProgress} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Upcoming Session (3 columns) */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Next Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{mockData.nextSession.title}</h4>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{mockData.nextSession.date}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{mockData.nextSession.time}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <span>{mockData.nextSession.student}</span>
                  </div>
                </div>
                
                <Button className="w-full bg-[#1F4E79] hover:bg-[#1a4369]">
                  Start Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManageClass;
