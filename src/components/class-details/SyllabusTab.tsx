
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface SyllabusItem {
  week: number;
  title: string;
  description: string;
}

interface SyllabusTabProps {
  syllabus: SyllabusItem[];
}

const SyllabusTab = ({ syllabus }: SyllabusTabProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-3">Class Curriculum</h3>
      <div className="space-y-4">
        {syllabus.map((week) => (
          <Card key={week.week}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold">Week {week.week}: {week.title}</h4>
                <Badge variant="outline">1 hour</Badge>
              </div>
              <p className="text-muted-foreground">{week.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SyllabusTab;
