
import React from 'react';
import { Calendar, Users, Globe, MapPin, Eye, Edit, Clock } from 'lucide-react';
import { TutorClass } from '@/hooks/use-tutor-classes';

interface ClassCardProps {
  classItem: TutorClass;
  onEdit: (classItem: TutorClass) => void;
  onManage: (classItem: TutorClass) => void;
}

const ClassCard = ({ classItem, onEdit, onManage }: ClassCardProps) => {
  const getDeliveryIcon = (deliveryMode: string) => {
    return deliveryMode === 'online' ? (
      <Globe className="h-4 w-4 text-blue-600" />
    ) : (
      <MapPin className="h-4 w-4 text-green-600" />
    );
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      inactive: "bg-gray-100 text-gray-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.inactive}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStudentLimit = (classSize: string, maxStudents: number | null) => {
    if (classSize === 'one-on-one') {
      return '1 student';
    }
    return maxStudents ? `Max ${maxStudents} students` : 'No limit';
  };

  const formatDateTime = () => {
    const createdDate = new Date(classItem.created_at);
    const dateStr = createdDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const timeStr = createdDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return { dateStr, timeStr };
  };

  const { dateStr, timeStr } = formatDateTime();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-32 bg-gradient-to-br from-primary to-purple-600">
        <div className="absolute top-3 right-3">
          {getStatusBadge(classItem.status)}
        </div>
        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-center text-sm">
            {getDeliveryIcon(classItem.delivery_mode)}
            <span className="ml-2 capitalize">{classItem.delivery_mode} • {classItem.class_size}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">{classItem.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{classItem.description || "No description available"}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{dateStr}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>{timeStr}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2" />
            <span>{getStudentLimit(classItem.class_size, classItem.max_students)}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => onManage(classItem)}
            className="flex-1 bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors flex items-center justify-center"
          >
            <Eye className="h-4 w-4 mr-1" />
            Manage
          </button>
          <button 
            onClick={() => onEdit(classItem)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
