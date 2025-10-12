import { Video, Award, CalendarDays, Users } from 'lucide-react';

const FeatureHighlights = () => {
  const features = [
    {
      icon: <Video className="w-6 h-6 text-[#F97316]" />,
      text: "Live video chat classes"
    },
    {
      icon: <Award className="w-6 h-6 text-[#F97316]" />,
      text: "World class teachers"
    },
    {
      icon: <CalendarDays className="w-6 h-6 text-[#F97316]" />,
      text: "Flexible learning options"
    },
    {
      icon: <Users className="w-6 h-6 text-[#F97316]" />,
      text: "Learners ages 3 - 18"
    }
  ];

  return (
    <div className="w-full bg-[#F8F9FA] py-4 md:py-4 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-between items-center gap-4 md:gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-xs md:text-base text-gray-700">
              <div className="shrink-0">{feature.icon}</div>
              <span className="leading-tight">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureHighlights;
