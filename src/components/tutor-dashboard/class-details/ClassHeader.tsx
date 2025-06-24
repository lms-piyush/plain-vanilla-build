
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ClassDetails } from "@/hooks/use-class-details";

interface ClassHeaderProps {
  classDetails: ClassDetails;
}

const ClassHeader = ({ classDetails }: ClassHeaderProps) => {
  return (
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
  );
};

export default ClassHeader;
