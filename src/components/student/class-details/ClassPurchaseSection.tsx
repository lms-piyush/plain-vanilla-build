
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, MapPin, Video, DollarSign } from "lucide-react";
import AddressModal from "../AddressModal";

interface ClassPurchaseSectionProps {
  classDetails: any;
}

const ClassPurchaseSection = ({ classDetails }: ClassPurchaseSectionProps) => {
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const isOfflineClass = classDetails.delivery_mode === 'offline';

  return (
    <>
      <Card className="sticky top-4">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Price */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-3xl font-bold text-green-600">
                  ${classDetails.price || 0}
                </span>
                <span className="text-gray-500">
                  {classDetails.currency || 'USD'}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {classDetails.duration_type === 'recurring' ? 'Per Session' : 'One-time'}
              </Badge>
            </div>

            {/* Class Info */}
            <div className="space-y-3 py-4 border-y">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {classDetails.class_time_slots?.[0] 
                    ? `${classDetails.class_time_slots[0].start_time} - ${classDetails.class_time_slots[0].end_time}`
                    : 'Time TBD'
                  }
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {classDetails.class_size === 'one-on-one' 
                    ? '1-on-1 Session' 
                    : `Group (Max ${classDetails.max_students || 'Unlimited'} students)`
                  }
                </span>
              </div>

              <div className="flex items-center gap-3">
                {isOfflineClass ? (
                  <MapPin className="h-4 w-4 text-gray-500" />
                ) : (
                  <Video className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-sm capitalize">
                  {classDetails.delivery_mode} Class
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isOfflineClass ? (
                <>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    onClick={() => setAddressModalOpen(true)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    View Address
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    size="lg"
                  >
                    Enroll Now
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    Join Class Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    size="lg"
                  >
                    Enroll for Later
                  </Button>
                </>
              )}
            </div>

            {/* Additional Info */}
            <div className="text-xs text-gray-500 text-center pt-2">
              <p>30-day money-back guarantee</p>
              <p>Cancel anytime</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddressModal 
        open={addressModalOpen}
        onOpenChange={setAddressModalOpen}
        classDetails={classDetails}
      />
    </>
  );
};

export default ClassPurchaseSection;
