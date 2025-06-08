
import React from 'react';
import { Globe, MapPin } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface ClassCardHeaderProps {
  deliveryMode: string;
  classSize: string;
  status: string;
}

const ClassCardHeader = ({ deliveryMode, classSize, status }: ClassCardHeaderProps) => {
  const getDeliveryIcon = (deliveryMode: string) => {
    return deliveryMode === 'online' ? (
      <Globe className="h-4 w-4 text-blue-600" />
    ) : (
      <MapPin className="h-4 w-4 text-green-600" />
    );
  };

  return (
    <div className="relative h-32 bg-gradient-to-br from-primary to-purple-600">
      <div className="absolute top-3 right-3">
        <StatusBadge status={status} />
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
