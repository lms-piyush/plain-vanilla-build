
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { ClassCreationState } from "@/hooks/use-class-creation-store";

interface ClassPreviewCardProps {
  formState: ClassCreationState;
  formatClassType: () => string;
}

const ClassPreviewCard = ({ formState, formatClassType }: ClassPreviewCardProps) => {
  return (
    <div className="space-y-4">
      {/* Class Image Placeholder */}
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        {formState.thumbnailUrl ? (
          <img 
            src={formState.thumbnailUrl} 
            alt="Class thumbnail" 
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <p className="text-gray-500">No thumbnail uploaded</p>
        )}
      </div>

      {/* Class Title and Type */}
      <div>
        <h3 className="text-xl font-semibold mb-2">
          {formState.title || 'Untitled Class'}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{formatClassType()}</p>
        <Badge variant="secondary" className="text-xs">
          {formState.subject || 'No subject'}
        </Badge>
      </div>

      {/* Description */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            {formState.description || 'No description provided'}
          </p>
        </CardContent>
      </Card>

      {/* Syllabus Preview */}
      {formState.syllabus.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Syllabus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formState.syllabus.map((item, index) => (
                <div key={index} className="border-l-2 border-blue-200 pl-3">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClassPreviewCard;
