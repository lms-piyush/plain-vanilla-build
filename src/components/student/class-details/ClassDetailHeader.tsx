
import React from "react";
import { Star, Users, Clock, Globe, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClassDetailHeaderProps {
  title: string;
  tutor: string;
  deliveryMode: string;
  classFormat: string;
  classSize: string;
  studentCount: number;
  averageRating: number;
  totalReviews: number;
  price?: number;
  currency?: string;
  thumbnailUrl?: string;
}

const ClassDetailHeader = ({
  title,
  tutor,
  deliveryMode,
  classFormat,
  classSize,
  studentCount,
  averageRating,
  totalReviews,
  price,
  currency = "USD",
  thumbnailUrl
}: ClassDetailHeaderProps) => {
  const getDeliveryIcon = () => {
    return deliveryMode === 'online' ? <Globe className="h-4 w-4" /> : <MapPin className="h-4 w-4" />;
  };

  const getFormatLabel = () => {
    if (deliveryMode === 'online') {
      return classFormat === 'live' ? 'Online Live' : 'Online Recorded';
    } else {
      return classFormat === 'inbound' ? 'Offline Inbound' : 'Offline Outbound';
    }
  };

  const getSizeLabel = () => {
    return classSize === 'group' ? 'Group' : '1-on-1';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {thumbnailUrl && (
          <div className="w-full lg:w-80 h-48 rounded-lg overflow-hidden">
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-lg text-gray-600">by {tutor}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {getDeliveryIcon()}
              {getFormatLabel()}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {getSizeLabel()}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {studentCount} {studentCount === 1 ? 'student' : 'students'}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
              <span className="font-semibold">
                {totalReviews > 0 ? averageRating.toFixed(1) : 'No reviews'}
              </span>
              {totalReviews > 0 && (
                <span className="text-gray-500">
                  ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              )}
            </div>
          </div>

          {price && (
            <div className="text-2xl font-bold text-green-600">
              {currency === 'USD' ? '$' : currency}{price}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassDetailHeader;
