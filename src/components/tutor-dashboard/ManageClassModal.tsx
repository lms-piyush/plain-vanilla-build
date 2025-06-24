
import React, { useState } from 'react';
import { X, Calendar, Users, BookOpen, Settings, Clock, User, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TutorClass } from '@/hooks/use-tutor-classes';
import ManageClassActionsModal from './ManageClassActionsModal';

interface ManageClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: TutorClass | null;
  onEdit: (classItem: TutorClass) => void;
  onDelete: (classItem: TutorClass) => void;
}

const ManageClassModal = ({ isOpen, onClose, classData, onEdit, onDelete }: ManageClassModalProps) => {
  const [actionsModalOpen, setActionsModalOpen] = useState(false);

  if (!classData) return null;

  // Mock data for demonstration
  const mockData = {
    student: {
      name: "Alex Johnson",
      type: "Individual learner"
    },
    stats: {
      sessions: { completed: 5, total: 12 },
      rating: 4.7,
      ratingCount: 50,
      earnings: 960
    },
    completion: 65,
    nextSession: {
      title: "Functions and Modules",
      date: "June 15, 2023",
      time: "4:00 PM - 5:30 PM",
      student: "Alex Johnson"
    },
    sessions: [
      { id: 1, title: "Introduction to Python Basics", date: "June 1, 2023", time: "4:00 PM - 5:30 PM", status: "completed", attendance: "Present", materials: 2, notes: "Student showed good progress understan..." },
      { id: 2, title: "Variables and Data Types", date: "June 4, 2023", time: "4:00 PM - 5:30 PM", status: "completed", attendance: "Present", materials: 3, notes: "Good understanding of data types, but ne..." },
      { id: 3, title: "Control Flow and Conditionals", date: "June 8, 2023", time: "4:00 PM - 5:30 PM", status: "completed", attendance: "Present", materials: 1, notes: "Excellent progress with if-statements and..." },
      { id: 4, title: "Loops and Iterations", date: "June 11, 2023", time: "4:00 PM - 5:30 PM", status: "completed", attendance: "Present", materials: 2, notes: "Still struggling with nested loops, will focu..." },
      { id: 5, title: "Functions and Modules", date: "June 15, 2023", time: "4:00 PM - 5:30 PM", status: "upcoming", attendance: "-", materials: 4, notes: "-" }
    ]
  };

  const getStatusBadge = (status: string) => {
    return status === 'completed' ? (
      <Badge className="bg-green-100 text-green-800">Completed</Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold text-[#1F4E79]">
                  {classData.title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-blue-100 text-blue-800">{classData.status}</Badge>
                  <Badge className="bg-green-100 text-green-800">Live Class</Badge>
                  <span className="text-gray-600">{classData.subject || 'Programming'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onEdit(classData)}>
                  Edit Class
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => setActionsModalOpen(true)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Class Overview Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{mockData.student.name}</h3>
                  <p className="text-sm text-gray-600">{mockData.student.type}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Sessions: {mockData.stats.sessions.completed}/{mockData.stats.sessions.total}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Rating: {mockData.stats.rating}/5.0</span>
                  <span className="text-xs text-gray-500">({mockData.stats.ratingCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">💰 Earnings: ${mockData.stats.earnings}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Course Completion</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Progress</span>
                  <span className="text-sm font-medium">{mockData.completion}%</span>
                </div>
                <Progress value={mockData.completion} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Next Session</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h5 className="font-medium text-sm">{mockData.nextSession.title}</h5>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>Due: {mockData.nextSession.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>{mockData.nextSession.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <User className="h-3 w-3" />
                  <span>{mockData.nextSession.student}</span>
                </div>
                <Button className="w-full mt-3 bg-[#1F4E79] hover:bg-[#1a4369]">
                  Start Session
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="sessions" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="sessions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Sessions</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">New Session</Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">Manage your 1-on-1 class sessions</p>
              
              <div className="space-y-3">
                {mockData.sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h4 className="font-medium">{session.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>{session.date}</span>
                        <span>{session.time}</span>
                        <span>Attendance: {session.attendance}</span>
                        <span>Materials: {session.materials}</span>
                      </div>
                      {session.notes !== "-" && (
                        <p className="text-sm text-gray-600 mt-1">{session.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(session.status)}
                      {session.status === 'upcoming' && (
                        <Button size="sm" className="bg-[#1F4E79] hover:bg-[#1a4369]">
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <h3 className="text-lg font-semibold">Students</h3>
              <p className="text-sm text-gray-600">Manage enrolled students in this class</p>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{mockData.student.name}</h4>
                    <p className="text-sm text-gray-600">{mockData.student.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Progress: {mockData.completion}%</p>
                    <p className="text-xs text-gray-600">Sessions: {mockData.stats.sessions.completed}/{mockData.stats.sessions.total}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <h3 className="text-lg font-semibold">Materials</h3>
              <p className="text-sm text-gray-600">Manage course materials and resources</p>
              
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-2" />
                <p>No materials uploaded yet</p>
                <Button className="mt-2" variant="outline">Upload Materials</Button>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <h3 className="text-lg font-semibold">Settings</h3>
              <p className="text-sm text-gray-600">Class configuration and settings</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Class Title</label>
                    <input 
                      type="text" 
                      value={classData.title} 
                      className="w-full p-2 border rounded"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <input 
                      type="text" 
                      value={classData.subject || 'Programming'} 
                      className="w-full p-2 border rounded"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price</label>
                    <input 
                      type="text" 
                      value={`$${classData.price || 0}`} 
                      className="w-full p-2 border rounded"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <input 
                      type="text" 
                      value={classData.status} 
                      className="w-full p-2 border rounded"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ManageClassActionsModal
        isOpen={actionsModalOpen}
        onClose={() => setActionsModalOpen(false)}
        classData={classData}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
};

export default ManageClassModal;
