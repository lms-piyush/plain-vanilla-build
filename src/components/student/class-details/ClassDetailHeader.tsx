
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, User } from "lucide-react";
import { StudentClassDetails } from "@/hooks/use-student-class-details";

interface ClassDetailHeaderProps {
  classDetails: StudentClassDetails;
}

const ClassDetailHeader = ({ classDetails }: ClassDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mb-4"
        >
          Back
        </Button>
      </div>
      
      {/* Course Header Section */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
        <div className="relative aspect-video">
          <img
            src={classDetails.thumbnail_url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800"}
            alt={classDetails.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6">
          {/* Course Title */}
          <h1 className="text-2xl font-bold mb-4">{classDetails.title}</h1>
          
          {/* Course Info Bar */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4">
            {/* Tutor */}
            <button 
              className="text-base font-medium text-[#8A5BB7] hover:underline flex items-center"
              onClick={() => navigate(`/tutor/${classDetails.tutor_id}`)}
            >
              <User className="mr-1 h-4 w-4" />
              {classDetails.tutor_name}
            </button>
            
            {/* Rating - dummy data */}
            <div className="flex items-center">
              <Star className="fill-yellow-400 stroke-yellow-400 h-4 w-4 mr-1" />
              <span className="text-sm font-medium">4.8</span>
              <span className="text-sm text-gray-500 ml-1">(128 reviews)</span>
            </div>
            
            {/* Class Size */}
            <div className="text-sm">
              {classDetails.class_size === "group" ? 
                `${classDetails.max_students || 40} students` : 
                <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">1-on-1</span>
              }
            </div>
          </div>
          
          {/* Course Overview */}
          <div className="text-gray-700 mb-6">
            {classDetails.description || "This course provides comprehensive learning experience with hands-on practice and expert guidance."}
          </div>
          
          {/* Course Attributes */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-2 py-1 rounded-full bg-[#E5D0FF] text-xs text-[#8A5BB7]">
              {classDetails.delivery_mode === 'online' ? 'Online' : 'Offline'}
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">
              {classDetails.class_format}
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">
              {classDetails.class_size === "group" ? `${classDetails.max_students || 40} students` : "1-on-1"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassDetailHeader;
