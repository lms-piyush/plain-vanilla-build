
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit, Trash2 } from "lucide-react";
import { ClassDetails } from "@/hooks/use-class-details";

interface ClassSettingsCardProps {
  classDetails: ClassDetails;
}

const ClassSettingsCard = ({ classDetails }: ClassSettingsCardProps) => {
  const handleEditClass = () => {
    // Handle edit class functionality
    console.log("Edit class settings");
  };

  const handleDeleteClass = () => {
    // Handle delete class functionality
    console.log("Delete class");
  };

  return (
    <Card className="border-[#1F4E79]/10">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-lg font-semibold text-[#1F4E79]">Class Settings</CardTitle>
        <CardDescription>Manage settings for your 1-on-1 class</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Class Description</h3>
            <p className="text-sm text-muted-foreground">{classDetails.description || "No description available"}</p>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Status</h3>
              <div className="flex items-center">
                <Badge className={`${classDetails.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {classDetails.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Class Type</h3>
              <div className="flex items-center gap-2">
                <Badge className="bg-indigo-100 text-indigo-800">
                  {classDetails.class_size === 'one-on-one' ? '1-on-1' : 'Group'}
                </Badge>
                
                <Badge className="bg-blue-100 text-blue-800">
                  {classDetails.delivery_mode === 'online' ? 'Online' : 'Offline'} {classDetails.class_format}
                </Badge>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Subject</h3>
              <div className="flex items-center">
                <Badge className="bg-purple-100 text-purple-800">
                  {classDetails.subject || 'No subject specified'}
                </Badge>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Price</h3>
              <div className="flex items-center">
                <Badge className="bg-green-100 text-green-800">
                  {classDetails.currency || 'USD'} {classDetails.price || '0'}
                </Badge>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs border-[#1F4E79] text-[#1F4E79] hover:bg-[#F5F7FA]"
              onClick={handleEditClass}
            >
              <Edit className="mr-1 h-3.5 w-3.5" />
              Edit Settings
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleDeleteClass}
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Delete Class
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassSettingsCard;
