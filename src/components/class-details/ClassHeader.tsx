
import { Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LectureTypeBadge from "@/components/LectureTypeBadge";
import { useToast } from "@/hooks/use-toast";

interface ClassHeaderProps {
  image: string;
  title: string;
  lectureType: string;
}

const ClassHeader = ({ image, title, lectureType }: ClassHeaderProps) => {
  const { toast } = useToast();

  const toggleSave = () => {
    toast({
      title: "Added to saved classes",
      description: "The class has been added to your saved list.",
    });
  };
  
  const shareClass = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this class with others.",
    });
  };

  return (
    <div className="relative rounded-lg overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="w-full aspect-video object-cover"
      />
      <div className="absolute top-4 left-4">
        <LectureTypeBadge type={lectureType as any} size="md" />
      </div>
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button onClick={toggleSave} size="icon" variant="secondary" className="rounded-full">
          <Heart className="h-5 w-5" />
          <span className="sr-only">Save this class</span>
        </Button>
        <Button onClick={shareClass} size="icon" variant="secondary" className="rounded-full">
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Share this class</span>
        </Button>
      </div>
    </div>
  );
};

export default ClassHeader;
