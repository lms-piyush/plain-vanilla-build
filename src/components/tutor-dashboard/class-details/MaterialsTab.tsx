
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Download, Edit, Trash2 } from "lucide-react";
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
  const getFilteredMaterials = () => {
    if (selectedSessionFilter === 'all') {
      return classDetails.class_syllabus?.flatMap(session => 
        session.lesson_materials?.map(material => ({
          ...material,
          session_title: session.title,
          session_number: session.week_number
        })) || []
      ) || [];
    } else {
      const session = classDetails.class_syllabus?.find(s => s.id === selectedSessionFilter);
      return session?.lesson_materials?.map(material => ({
        ...material,
        session_title: session.title,
        session_number: session.week_number
      })) || [];
    }
  };

  const filteredMaterials = getFilteredMaterials();

  const getFileSize = (materialType: string) => {
    // Mock file sizes based on type
    const sizes = {
      'presentation': '2.4 MB',
      'document': '560 KB',
      'video': '45.2 MB',
      'worksheet': '320 KB',
      'link': '-'
    };
    return sizes[materialType as keyof typeof sizes] || '1.2 MB';
  };

  const getUploadDate = () => {
    // Mock upload dates
    const dates = ['May 30, 2023', 'May 31, 2023', 'June 6, 2023', 'June 13, 2023'];
    return dates[Math.floor(Math.random() * dates.length)];
  };

  const getDownloadCount = () => {
    // Mock download counts
    return Math.floor(Math.random() * 10) + 1;
  };

  return (
    <Card className="border-[#1F4E79]/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-[#1F4E79]">Class Materials</CardTitle>
          <CardDescription>Manage teaching resources for your 1-on-1 class</CardDescription>
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
                Session {session.week_number}
              </Badge>
            ))}
          </div>
        </div>
        
        {filteredMaterials.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>For Session</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">
                    {material.material_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {material.material_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getFileSize(material.material_type)}
                  </TableCell>
                  <TableCell>
                    {selectedSessionFilter === 'all' && (material as any).session_title 
                      ? `Session ${(material as any).session_number}`
                      : classDetails.class_syllabus?.find(s => s.lesson_materials?.some(m => m.id === material.id))?.week_number 
                        ? `Session ${classDetails.class_syllabus?.find(s => s.lesson_materials?.some(m => m.id === material.id))?.week_number}`
                        : 'Session 1'
                    }
                  </TableCell>
                  <TableCell>
                    {getUploadDate()}
                  </TableCell>
                  <TableCell>
                    {getDownloadCount()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditMaterial(material)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {selectedSessionFilter === 'all' ? 'No materials uploaded yet' : 'No materials for this session'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterialsTab;
