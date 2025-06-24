import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Star, 
  MoreHorizontal,
  ChevronRight,
  Edit,
  Trash2,
  Copy,
  Globe,
  MapPin
} from "lucide-react";

import TutorDashboardLayout from "@/components/TutorDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useTutorClasses } from "@/hooks/use-tutor-classes";
import SimpleCreateClassDialog from "@/components/tutor-dashboard/SimpleCreateClassDialog";

const MyClasses = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [createClassDialogOpen, setCreateClassDialogOpen] = useState(false);
  const { classes, isLoading, error, refetch } = useTutorClasses();

  const handleCreateClass = () => {
    setCreateClassDialogOpen(true);
  };

  const handleClassCreated = () => {
    refetch();
  };

  const handleEdit = (classItem: any) => {
    toast({
      title: "Edit Class",
      description: `Opening edit for "${classItem.title}"`,
    });
    // Existing edit logic implementation
  };

  const handleDelete = (id: string, title: string) => {
    toast({
      title: "Confirm deletion",
      description: `Are you sure you want to delete "${title}"?`,
      variant: "destructive",
    });
    // Existing delete logic implementation
  };

  const handleDuplicate = (id: string, title: string) => {
    toast({
      title: "Class duplicated",
      description: `"${title}" has been duplicated. You can find it in your drafts.`,
    });
  };

  // Filter classes based on search term
  const filteredClasses = classes.filter(
    (c) => c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeClasses = filteredClasses.filter(c => c.status === 'active');
  const draftClasses = filteredClasses.filter(c => c.status === 'draft');
  const inactiveClasses = filteredClasses.filter(c => c.status === 'inactive');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Draft</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 text-xs">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">{status}</Badge>;
    }
  };

  const getDeliveryIcon = (deliveryMode: string) => {
    return deliveryMode === 'online' ? (
      <Globe className="h-3.5 w-3.5 mr-2 text-[#1F4E79]" />
    ) : (
      <MapPin className="h-3.5 w-3.5 mr-2 text-[#1F4E79]" />
    );
  };

  const renderClassCard = (classItem: any) => (
    <Card key={classItem.id} className="overflow-hidden hover:shadow-md transition-all border-[#1F4E79]/10">
      <div className="relative h-40 bg-gradient-to-br from-[#1F4E79] to-[#8A5BB7]">
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => handleEdit(classItem)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => handleDuplicate(classItem.id, classItem.title)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50"
                onClick={() => handleDelete(classItem.id, classItem.title)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center text-sm">
            {classItem.delivery_mode === 'online' ? (
              <Globe className="h-3.5 w-3.5 mr-2 text-white" />
            ) : (
              <MapPin className="h-3.5 w-3.5 mr-2 text-white" />
            )}
            <span className="capitalize">{classItem.delivery_mode} • {classItem.class_size}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge className={`${
            classItem.status === 'active' ? 'bg-green-100 text-green-800' :
            classItem.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {classItem.status === 'active' ? 'Active' : 
             classItem.status === 'draft' ? 'Draft' : 'Inactive'}
          </Badge>
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 fill-[#F29F05] text-[#F29F05]" />
            <span className="text-xs ml-1 font-medium">-</span>
          </div>
        </div>
        <Link to={`/tutor-dashboard/classes/${classItem.id}`}>
          <h3 className="text-base font-semibold text-[#1F4E79] hover:underline mb-1">{classItem.title}</h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-3">{classItem.description || "No description"}</p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-xs">
            <Calendar className="h-3.5 w-3.5 mr-2 text-[#1F4E79]" />
            <span>Created {new Date(classItem.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-xs">
            <Users className="h-3.5 w-3.5 mr-2 text-[#1F4E79]" />
            <span>{classItem.max_students ? `Max ${classItem.max_students} students` : 'No limit'}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            asChild
            className="flex-1 bg-[#1F4E79] hover:bg-[#1a4369] transition-all hover:scale-[0.98] active:scale-[0.97] text-xs"
          >
            <Link to={`/tutor-dashboard/classes/${classItem.id}`}>Manage Class</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <TutorDashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-500">Error loading classes: {error}</p>
          <Button onClick={refetch} className="mt-4">Retry</Button>
        </div>
      </TutorDashboardLayout>
    );
  }

  return (
    <TutorDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1F4E79]">My Classes</h1>
            <p className="text-muted-foreground">Manage your created classes</p>
          </div>
          <Button onClick={handleCreateClass} className="bg-[#1F4E79] hover:bg-[#1a4369]">
            <Plus className="mr-1 h-4 w-4" />
            Create New Class
          </Button>
        </div>

        <SimpleCreateClassDialog
          open={createClassDialogOpen}
          onOpenChange={setCreateClassDialogOpen}
          onClassCreated={handleClassCreated}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search classes..."
              className="pl-8 border-[#1F4E79]/20 focus-visible:ring-[#1F4E79]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-[#1F4E79]/20 text-muted-foreground gap-1 whitespace-nowrap">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full bg-white border-b border-[#1F4E79]/10 rounded-none p-0 h-auto">
            <TabsTrigger 
              value="active" 
              className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
            >
              Active Classes ({classes.filter(c => c.status === 'active').length})
            </TabsTrigger>
            <TabsTrigger 
              value="drafts" 
              className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
            >
              Drafts ({classes.filter(c => c.status === 'draft').length})
            </TabsTrigger>
            <TabsTrigger 
              value="inactive" 
              className="rounded-none text-sm py-3 px-4 data-[state=active]:text-[#1F4E79] data-[state=active]:border-b-2 data-[state=active]:border-[#1F4E79] font-medium data-[state=active]:shadow-none"
            >
              Inactive Classes ({classes.filter(c => c.status === 'inactive').length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="pt-4">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading classes...</p>
              </div>
            ) : classes.filter(c => c.status === 'active').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.filter(c => c.status === 'active').map(renderClassCard)}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-[#1F4E79]/10">
                <p className="text-muted-foreground mb-2">No active classes found</p>
                <Button onClick={handleCreateClass} className="bg-[#1F4E79] hover:bg-[#1a4369] text-sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Create Your First Class
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="drafts" className="pt-4">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading drafts...</p>
              </div>
            ) : classes.filter(c => c.status === 'draft').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.filter(c => c.status === 'draft').map(renderClassCard)}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-[#1F4E79]/10">
                <p className="text-muted-foreground">No draft classes found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="inactive" className="pt-4">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading inactive classes...</p>
              </div>
            ) : classes.filter(c => c.status === 'inactive').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.filter(c => c.status === 'inactive').map(renderClassCard)}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-[#1F4E79]/10">
                <p className="text-muted-foreground">No inactive classes found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </TutorDashboardLayout>
  );
};

export default MyClasses;
