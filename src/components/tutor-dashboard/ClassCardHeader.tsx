
import React from 'react';
import { Globe, MapPin } from 'lucide-react';

interface ClassCardHeaderProps {
  status: string;
  deliveryMode: string;
  classSize: string;
}

const ClassCardHeader = ({ status, deliveryMode, classSize }: ClassCardHeaderProps) => {
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

  return (
    <div className="relative h-32 bg-gradient-to-br from-primary to-purple-600">
      <div className="absolute top-3 right-3">
        {getStatusBadge(status)}
      </div>
      <div className="absolute bottom-3 left-3 text-white">
        <div className="flex items-center text-sm">
          {getDeliveryIcon(deliveryMode)}
          <span className="ml-2 capitalize">{deliveryMode} • {classSize}</span>
        </div>
      </div>
    </div>
  );
};

export default ClassCardHeader;
