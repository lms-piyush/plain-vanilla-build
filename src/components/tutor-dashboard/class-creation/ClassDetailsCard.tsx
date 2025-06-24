
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, DollarSign, MapPin, Link as LinkIcon } from "lucide-react";
import { ClassCreationState } from "@/hooks/use-class-creation-store";

interface ClassDetailsCardProps {
  formState: ClassCreationState;
  formatSchedule: () => string;
  formatTimeSlots: () => string;
  formatPrice: () => string;
  getConnectionDetails: () => { type: string; detail: string };
}

const ClassDetailsCard = ({ 
  formState, 
  formatSchedule, 
  formatTimeSlots, 
  formatPrice, 
  getConnectionDetails 
}: ClassDetailsCardProps) => {
  const connectionDetails = getConnectionDetails();

  return (
    <div className="space-y-4">
      {/* Schedule */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium">{formatSchedule()}</p>
          {formState.frequency && (
            <p className="text-xs text-gray-600 mt-1">
              Frequency: {formState.frequency.charAt(0).toUpperCase() + formState.frequency.slice(1)}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Time Slots */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{formatTimeSlots()}</p>
        </CardContent>
      </Card>

      {/* Class Size */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Class Size
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium">
            Max: {formState.maxStudents || 'Not set'}
            {formState.classSize === 'one-on-one' && ' (One-on-one)'}
          </p>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold text-green-600">{formatPrice()}</p>
          {formState.durationType === 'recurring' && formState.price && formState.price > 0 && (
            <p className="text-xs text-gray-600">
              Monthly fee • {formState.autoRenewal ? 'Auto-renewal' : 'Manual renewal'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Connection Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            {formState.deliveryMode === 'online' ? <LinkIcon className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
            Connection Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium">{connectionDetails.type}</p>
          <p className="text-sm text-gray-600 mt-1">{connectionDetails.detail}</p>
        </CardContent>
      </Card>

      {/* Class Materials */}
      {formState.materials.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Class Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {formState.materials.map((material, index) => (
                <p key={index} className="text-sm">
                  • {material.name} ({material.type})
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClassDetailsCard;
