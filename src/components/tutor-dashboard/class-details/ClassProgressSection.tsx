
import CourseProgress from "./CourseProgress";
import NextSession from "./NextSession";
import { ClassDetails } from "@/types/class-details";

interface ClassProgressSectionProps {
  classDetails: ClassDetails;
  completionRate: number;
}

const ClassProgressSection = ({ classDetails, completionRate }: ClassProgressSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <CourseProgress 
          classDetails={classDetails}
          completionRate={completionRate}
        />
      </div>
      <div className="lg:col-span-1">
        <NextSession classDetails={classDetails} />
      </div>
    </div>
  );
};

export default ClassProgressSection;
