
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin } from 'lucide-react';

interface ClassCardHeaderProps {
  status: string;
  deliveryMode: string;
  classSize: string;
  thumbnailUrl?: string | null;
}

const ClassCardHeader = ({ status, deliveryMode, classSize, thumbnailUrl }: ClassCardHeaderProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Draft</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  const getDeliveryIcon = () => {
    return deliveryMode === 'online' ? (
      <Globe className="h-4 w-4 text-white" />
    ) : (
      <MapPin className="h-4 w-4 text-white" />
    );
  };

  return (
    <div className="relative h-48 bg-gradient-to-br from-primary to-primary/80 overflow-hidden">
      {/* Thumbnail Image */}
      {thumbnailUrl ? (
        <img 
          src={thumbnailUrl} 
          alt="Class thumbnail"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80" />
      )}
      
      {/* Overlay with content */}
      <div className="absolute inset-0 bg-black/20">
        <div className="absolute top-3 left-3">
          {getStatusBadge(status)}
        </div>
        
        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-center text-sm">
            {getDeliveryIcon()}
            <span className="ml-2 capitalize">{deliveryMode} • {classSize}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassCardHeader;
