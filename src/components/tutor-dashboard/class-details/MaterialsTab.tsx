
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Download, Edit, Trash2 } from "lucide-react";
import { ClassDetails } from "@/hooks/use-class-details";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { deleteCourseMaterial } from "@/services/file-upload-service";

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
  const { toast } = useToast();

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

  const formatFileSize = (sizeInBytes: number | null) => {
    if (!sizeInBytes) return '-';
    
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatUploadDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const handleDownload = (material: any) => {
    if (material.material_url) {
      window.open(material.material_url, '_blank');
      // Increment download count
      incrementDownloadCount(material.id);
    }
  };

  const incrementDownloadCount = async (materialId: string) => {
    try {
      const { error } = await supabase
        .from('lesson_materials')
        .update({ 
          download_count: supabase.from('lesson_materials').select('download_count').eq('id', materialId).single().then(result => (result.data?.download_count || 0) + 1)
        })
        .eq('id', materialId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing download count:', error);
    }
  };

  const handleDeleteMaterial = async (material: any) => {
    try {
      // Delete file from storage if exists
      if (material.file_path) {
        await deleteCourseMaterial(material.file_path);
      }
      
      // Delete from database
      const { error } = await supabase
        .from('lesson_materials')
        .delete()
        .eq('id', material.id);

      if (error) throw error;

      toast({
        title: "Material deleted successfully",
        description: "The material has been removed.",
      });

      // Refresh the page or trigger a refetch
      window.location.reload();
    } catch (error: any) {
      console.error('Error deleting material:', error);
      toast({
        title: "Error deleting material",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-purple-100 text-purple-800';
      case 'document':
        return 'bg-blue-100 text-blue-800';
      case 'presentation':
        return 'bg-orange-100 text-orange-800';
      case 'worksheet':
        return 'bg-green-100 text-green-800';
      case 'link':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-3">Filter by session:</div>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedSessionFilter === 'all' ? 'default' : 'outline'} 
              className={`cursor-pointer transition-colors ${
                selectedSessionFilter === 'all' 
                  ? 'bg-[#1F4E79] hover:bg-[#1a4369]' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => onSessionFilterChange('all')}
            >
              All Sessions
            </Badge>
            {classDetails.class_syllabus?.map((session) => (
              <Badge 
                key={session.id}
                variant={selectedSessionFilter === session.id ? 'default' : 'outline'}
                className={`cursor-pointer transition-colors ${
                  selectedSessionFilter === session.id 
                    ? 'bg-[#1F4E79] hover:bg-[#1a4369]' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => onSessionFilterChange(session.id)}
              >
                Week {session.week_number}
              </Badge>
            ))}
          </div>
        </div>
        
        {filteredMaterials.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-medium">Title</TableHead>
                  <TableHead className="font-medium">Type</TableHead>
                  <TableHead className="font-medium">Size</TableHead>
                  <TableHead className="font-medium">For Session</TableHead>
                  <TableHead className="font-medium">Upload Date</TableHead>
                  <TableHead className="font-medium">Downloads</TableHead>
                  <TableHead className="font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map((material) => (
                  <TableRow key={material.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium">
                      {material.material_name}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`capitalize ${getTypeVariant(material.material_type)}`}
                      >
                        {material.material_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatFileSize(material.file_size)}
                    </TableCell>
                    <TableCell>
                      {selectedSessionFilter === 'all' && (material as any).session_title 
                        ? `Week ${(material as any).session_number}`
                        : classDetails.class_syllabus?.find(s => s.lesson_materials?.some(m => m.id === material.id))?.week_number 
                          ? `Week ${classDetails.class_syllabus?.find(s => s.lesson_materials?.some(m => m.id === material.id))?.week_number}`
                          : 'Week 1'
                      }
                    </TableCell>
                    <TableCell>
                      {formatUploadDate(material.upload_date)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {material.download_count || 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(material)}
                          className="h-8 w-8 p-0"
                          title="Download material"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditMaterial(material)}
                          className="h-8 w-8 p-0"
                          title="Edit material"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMaterial(material)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          title="Delete material"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50/30 rounded-lg border-2 border-dashed border-gray-200">
            <div className="max-w-sm mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedSessionFilter === 'all' ? 'No materials uploaded yet' : 'No materials for this session'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {selectedSessionFilter === 'all' 
                  ? 'Upload your first teaching material to get started.'
                  : 'Upload materials for this session to enhance your teaching.'}
              </p>
              <Button 
                variant="outline" 
                className="bg-white"
                onClick={onNewMaterial}
              >
                <Plus className="mr-2 h-4 w-4" />
                Upload Material
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaterialsTab;
