
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Video, Image, File } from "lucide-react";
import { StudentClassDetails } from "@/hooks/use-student-class-details";

interface ResourcesTabProps {
  classDetails: StudentClassDetails;
}

const ResourcesTab = ({ classDetails }: ResourcesTabProps) => {
  const getFileIcon = (materialType: string) => {
    switch (materialType.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'video':
      case 'mp4':
        return <Video className="h-4 w-4" />;
      case 'image':
      case 'jpg':
      case 'png':
        return <Image className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const formatFileSize = (sizeInBytes: number | null) => {
    if (!sizeInBytes) return '';
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${Math.round(sizeInBytes / 1024)} KB`;
    return `${Math.round(sizeInBytes / (1024 * 1024))} MB`;
  };

  const handleDownload = (material: any) => {
    console.log('Downloading material:', material.material_name);
    // Handle download logic here
  };

  // Group materials by lesson title
  const materialsGroupedByLesson = classDetails.lessons?.reduce((acc, lesson) => {
    if (lesson.materials && lesson.materials.length > 0) {
      acc[lesson.title] = lesson.materials;
    }
    return acc;
  }, {} as Record<string, any[]>) || {};

  // If no materials exist, show dummy data grouped by sessions
  const finalMaterialsGroup = Object.keys(materialsGroupedByLesson).length > 0 
    ? materialsGroupedByLesson 
    : {};

  return (
    <div className="space-y-6">
      {Object.entries(finalMaterialsGroup).map(([lessonTitle, materials]) => (
        <Card key={lessonTitle}>
          <CardHeader>
            <CardTitle className="text-lg">{lessonTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materials.map((material) => (
                <div 
                  key={material.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(material.material_type)}
                    <div>
                      <p className="font-medium text-sm">{material.material_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {material.material_type.toUpperCase()}
                        </Badge>
                        {material.file_size && (
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(material.file_size)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(material)}
                    className="ml-2"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {Object.keys(finalMaterialsGroup).length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No resources available yet</p>
        </div>
      )}
    </div>
  );
};

export default ResourcesTab;
