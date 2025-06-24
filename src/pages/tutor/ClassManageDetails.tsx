
import { useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  Users, 
  Edit, 
  Star, 
  MessageSquare, 
  Download,
  Trash2,
  Video,
  BookOpen,
  CheckSquare,
  X,
  Plus,
  ChevronRight,
  Upload,
  User,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useClassDetails } from "@/hooks/use-class-details";
import { useClassSessions } from "@/hooks/use-class-sessions";
import SessionDialog from "@/components/tutor-dashboard/SessionDialog";
import MaterialDialog from "@/components/tutor-dashboard/MaterialDialog";

const ClassManageDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { classDetails, isLoading, error, refetch } = useClassDetails(id!);
  const { deleteSession } = useClassSessions();
  
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [selectedSessionFilter, setSelectedSessionFilter] = useState<string>('all');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading class details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading class: {error}</p>
          <Button onClick={refetch}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!classDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Class not found</p>
        </div>
      </div>
    );
  }

  const getNextSession = () => {
    if (!classDetails.class_schedules?.[0] || !classDetails.class_time_slots?.[0]) {
      return null;
    }

    const schedule = classDetails.class_schedules[0];
    const timeSlot = classDetails.class_time_slots[0];
    
    // Calculate next session based on frequency
    const today = new Date();
    const startDate = new Date(schedule.start_date || today);
    
    // Simple logic to get next session (you can enhance this)
    const nextSession = new Date(startDate);
    if (schedule.frequency === 'weekly') {
      nextSession.setDate(today.getDate() + 7);
    } else if (schedule.frequency === 'daily') {
      nextSession.setDate(today.getDate() + 1);
    } else if (schedule.frequency === 'monthly') {
      nextSession.setMonth(today.getMonth() + 1);
    }

    return {
      date: nextSession.toLocaleDateString(),
      time: `${timeSlot.start_time} - ${timeSlot.end_time}`,
      title: "Next Session"
    };
  };

  const handleEditSession = (session: any) => {
    setSelectedSession(session);
    setSessionDialogOpen(true);
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      refetch();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const handleEditMaterial = (material: any) => {
    setSelectedMaterial(material);
    setMaterialDialogOpen(true);
  };

  const nextSession = getNextSession();
  const enrolledCount = classDetails.enrolled_students?.length || 0;
  const completedSessions = classDetails.class_syllabus?.filter(s => s.week_number <= 5).length || 0;
  const totalSessions = classDetails.class_schedules?.[0]?.total_sessions || classDetails.class_syllabus?.length || 12;
  const completionRate = Math.round((completedSessions / totalSessions) * 100);

  // Filter materials by session
  const filteredMaterials = selectedSessionFilter === 'all' 
    ? classDetails.class_syllabus?.flatMap(session => 
        session.lesson_materials?.map(material => ({
          ...material,
          session_title: session.title,
          week_number: session.week_number
        })) || []
      ) || []
    : classDetails.class_syllabus?.find(s => s.id === selectedSessionFilter)?.lesson_materials || [];

  return (
    <div className="space-y-6 p-6">
      {/* Class Header */}
      <div className="relative rounded-xl overflow-hidden bg-white shadow-sm border border-[#1F4E79]/10">
        <div className="h-32 sm:h-40 md:h-48 w-full">
          <img 
            src={classDetails.thumbnail_url || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1000&h=300&q=80"} 
            alt={classDetails.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-[#1F4E79]">{classDetails.title}</h1>
                <Badge className={`${classDetails.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {classDetails.status === 'active' ? 'Active' : classDetails.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{classDetails.subject || "General Subject"}</p>
              <p className="text-sm text-gray-600 mt-2">{classDetails.description || "No description available"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline"
                size="sm" 
                className="text-xs border-[#1F4E79] text-[#1F4E79] hover:bg-[#F5F7FA]"
              >
                <Edit className="mr-1 h-3.5 w-3.5" />
                Edit Class
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="border-[#1F4E79]/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Students</p>
                <p className="text-2xl font-bold">{enrolledCount}</p>
              </div>
              <Users className="h-8 w-8 text-[#1F4E79]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1F4E79]/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sessions</p>
                <p className="text-2xl font-bold">{completedSessions}/{totalSessions}</p>
              </div>
              <Calendar className="h-8 w-8 text-[#1F4E79]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1F4E79]/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold">4.8</p>
              </div>
              <Star className="h-8 w-8 text-[#F29F05]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1F4E79]/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Earnings</p>
                <p className="text-2xl font-bold">${classDetails.price || 0}</p>
              </div>
              <BookOpen className="h-8 w-8 text-[#1F4E79]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Section (3/4) */}
        <div className="lg:col-span-3">
          <Card className="border-[#1F4E79]/10">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1F4E79]">Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Completion</span>
                    <span className="text-sm text-muted-foreground">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="w-full bg-[#F5F7FA] h-2 [&>*]:bg-[#1F4E79]" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-[#F5F7FA] p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Class Format</h4>
                    <p className="text-sm text-muted-foreground capitalize">{classDetails.class_format} • {classDetails.delivery_mode}</p>
                  </div>
                  <div className="bg-[#F5F7FA] p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Class Size</h4>
                    <p className="text-sm text-muted-foreground capitalize">{classDetails.class_size}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section (1/4) - Upcoming Session */}
        <div className="lg:col-span-1">
          <Card className="border-[#1F4E79]/10">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1F4E79]">Next Session</CardTitle>
            </CardHeader>
            <CardContent>
              {nextSession ? (
                <div className="space-y-4">
                  <div className="bg-[#F5F7FA] p-3 rounded-lg">
                    <p className="font-medium text-sm">{nextSession.title}</p>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center text-xs">
                        <Calendar className="h-3.5 w-3.5 mr-2 text-[#1F4E79]" />
                        <span>{nextSession.date}</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <Clock className="h-3.5 w-3.5 mr-2 text-[#1F4E79]" />
                        <span>{nextSession.time}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-[#1F4E79] hover:bg-[#1a4369] text-sm">
                    <Video className="mr-2 h-4 w-4" />
                    Start Session
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm">No upcoming sessions</p>
                  <Button variant="outline" className="mt-2 text-xs border-[#1F4E79] text-[#1F4E79]">
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Schedule Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="w-full bg-white border-b border-[#1F4E79]/10 rounded-none p-0 h-auto">
          <TabsTrigger 
            value="sessions"
            className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
          >
            Sessions
          </TabsTrigger>
          <TabsTrigger 
            value="students"
            className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
          >
            Students
          </TabsTrigger>
          <TabsTrigger 
            value="materials"
            className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
          >
            Materials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="pt-4">
          <Card className="border-[#1F4E79]/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-[#1F4E79]">Sessions</CardTitle>
                <CardDescription>Manage your class sessions</CardDescription>
              </div>
              <Button 
                size="sm" 
                className="text-xs bg-[#1F4E79] hover:bg-[#1a4369]"
                onClick={() => {
                  setSelectedSession(null);
                  setSessionDialogOpen(true);
                }}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                New Session
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classDetails.class_syllabus?.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Week {session.week_number}: {session.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {session.description || "No description"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditSession(session)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteSession(session.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!classDetails.class_syllabus || classDetails.class_syllabus.length === 0) && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No sessions created yet</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => {
                        setSelectedSession(null);
                        setSessionDialogOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Session
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="pt-4">
          <Card className="border-[#1F4E79]/10">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1F4E79]">Enrolled Students</CardTitle>
              <CardDescription>Students currently enrolled in this class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classDetails.enrolled_students?.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {enrollment.profiles?.full_name?.charAt(0) || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{enrollment.profiles?.full_name || 'Student Name'}</p>
                        <p className="text-sm text-muted-foreground">
                          Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={enrollment.status === 'active' ? 'default' : 'secondary'}>
                        {enrollment.status}
                      </Badge>
                      <Badge variant={enrollment.payment_status === 'paid' ? 'default' : 'destructive'}>
                        {enrollment.payment_status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {(!classDetails.enrolled_students || classDetails.enrolled_students.length === 0) && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No students enrolled yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="pt-4">
          <Card className="border-[#1F4E79]/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-[#1F4E79]">Class Materials</CardTitle>
                <CardDescription>Manage teaching resources</CardDescription>
              </div>
              <Button 
                size="sm" 
                className="text-xs bg-[#1F4E79] hover:bg-[#1a4369]"
                onClick={() => {
                  setSelectedMaterial(null);
                  setMaterialDialogOpen(true);
                }}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Upload Material
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Filter by session:</div>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={selectedSessionFilter === 'all' ? 'default' : 'outline'} 
                    className="cursor-pointer"
                    onClick={() => setSelectedSessionFilter('all')}
                  >
                    All Sessions
                  </Badge>
                  {classDetails.class_syllabus?.map((session) => (
                    <Badge 
                      key={session.id}
                      variant={selectedSessionFilter === session.id ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedSessionFilter(session.id)}
                    >
                      Week {session.week_number}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredMaterials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-[#1F4E79]" />
                      <div>
                        <p className="font-medium">{material.material_name}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {material.material_type}
                          {selectedSessionFilter === 'all' && material.session_title && 
                            ` • ${material.session_title}`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditMaterial(material)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {filteredMaterials.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {selectedSessionFilter === 'all' ? 'No materials uploaded yet' : 'No materials for this session'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <SessionDialog
        open={sessionDialogOpen}
        onOpenChange={setSessionDialogOpen}
        session={selectedSession}
        classId={id!}
        onSuccess={() => {
          refetch();
          setSessionDialogOpen(false);
        }}
      />

      <MaterialDialog
        open={materialDialogOpen}
        onOpenChange={setMaterialDialogOpen}
        material={selectedMaterial}
        classId={id!}
        sessions={classDetails.class_syllabus || []}
        onSuccess={() => {
          refetch();
          setMaterialDialogOpen(false);
        }}
      />
    </div>
  );
};

export default ClassManageDetails;
