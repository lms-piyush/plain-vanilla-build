
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ClassDetails } from "@/hooks/use-class-details";

interface CourseProgressProps {
  classDetails: ClassDetails;
  completionRate: number;
}

const CourseProgress = ({ classDetails, completionRate }: CourseProgressProps) => {
  return (
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
  );
};

export default CourseProgress;
