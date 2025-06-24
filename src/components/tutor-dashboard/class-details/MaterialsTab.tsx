
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Edit, Trash2, FileText } from "lucide-react";
import { ClassDetails } from "@/hooks/use-class-details";

interface MaterialsTabProps {
  classDetails: ClassDetails;
  selectedSessionFilter: string;
  onSessionFilterChange: (sessionId: string) => void;
  onEditMaterial: (material: any) => void;
  onNewMaterial: () => void;
}

const MaterialsTab = ({ 
  classDetails, 
  selectedSessionFilter, 
  onSessionFilterChange, 
  onEditMaterial,
  onNewMaterial 
}: MaterialsTabProps) => {
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
    <Card className="border-[#1F4E79]/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-[#1F4E79]">Class Materials</CardTitle>
          <CardDescription>Manage teaching resources</CardDescription>
        </div>
        <Button 
          size="sm" 
          className="text-xs bg-[#1F4E79] hover:bg-[#1a4369]"
          onClick={onNewMaterial}
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
              onClick={() => onSessionFilterChange('all')}
            >
              All Sessions
            </Badge>
            {classDetails.class_syllabus?.map((session) => (
              <Badge 
                key={session.id}
                variant={selectedSessionFilter === session.id ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => onSessionFilterChange(session.id)}
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
                    {selectedSessionFilter === 'all' && (material as any).session_title && 
                      ` • ${(material as any).session_title}`
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
                  onClick={() => onEditMaterial(material)}
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
  );
};

export default MaterialsTab;
