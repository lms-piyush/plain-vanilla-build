
import { Check, MapPin, Video, BookOpen } from "lucide-react";
import { getLectureTypeInfo } from "@/types/lecture-types";
import LectureTypeIcon from "@/components/LectureTypeIcon";

interface OverviewTabProps {
  description: string;
  lectureType: string;
  location?: string | null;
  learningObjectives: string[];
  requirements: string[];
}

const OverviewTab = ({ 
  description, 
  lectureType, 
  location, 
  learningObjectives, 
  requirements 
}: OverviewTabProps) => {
  const lectureTypeInfo = getLectureTypeInfo(lectureType as any);
  const isOffline = lectureType.startsWith("offline");
  const isRecorded = lectureType === "online-recorded-group" || 
                    lectureType === "online-recorded-one-on-one" || 
                    lectureType === "recorded-on-demand";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-3">About This Class</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-3">Class Format</h3>
        <div className="bg-muted p-4 rounded-lg flex items-start space-x-4 mb-4">
          <div className="bg-primary bg-opacity-10 p-3 rounded-full">
            <LectureTypeIcon type={lectureType as any} size={24} className="text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-base">{lectureTypeInfo.name}</h4>
            <p className="text-sm text-muted-foreground">{lectureTypeInfo.description}</p>
            
            {isOffline && location && (
              <div className="mt-2 flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{lectureTypeInfo.travelType === "in-call" ? "Tutor travels to your location" : "At tutor's location: " + location}</span>
              </div>
            )}
            
            {!isRecorded && (
              <div className="mt-2 flex items-center text-sm">
                <Video className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Live interactive sessions with the tutor</span>
              </div>
            )}
            
            {isRecorded && (
              <div className="mt-2 flex items-center text-sm">
                <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Watch anytime, unlimited access</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-3">What You'll Learn</h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {learningObjectives.map((objective, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span>{objective}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-bold mb-3">Requirements</h3>
        <ul className="space-y-2">
          {requirements.map((requirement, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <span>{requirement}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OverviewTab;
