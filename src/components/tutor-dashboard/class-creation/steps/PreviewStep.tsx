
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClassCreationStore } from "@/hooks/use-class-creation-store";
import { Calendar, Clock, Users, DollarSign, MapPin, Link as LinkIcon, BookOpen } from "lucide-react";

interface PreviewStepProps {
  onBack: () => void;
  onSaveAsDraft: () => void;
  onPublish: () => void;
}

const PreviewStep = ({ onBack, onSaveAsDraft, onPublish }: PreviewStepProps) => {
  const { formState } = useClassCreationStore();

  const formatClassType = () => {
    const parts = [];
    if (formState.deliveryMode) parts.push(formState.deliveryMode === 'online' ? 'Online' : 'Offline');
    if (formState.classFormat) parts.push(formState.classFormat.charAt(0).toUpperCase() + formState.classFormat.slice(1));
    if (formState.classSize) parts.push(formState.classSize === 'one-on-one' ? 'One-on-One' : 'Group');
    return parts.join(' ');
  };

  const formatSchedule = () => {
    if (!formState.startDate) return 'No schedule set';
    
    const startDate = new Date(formState.startDate).toLocaleDateString();
    let frequency = '';
    
    if (formState.durationType === 'recurring' && formState.frequency) {
      frequency = `${formState.frequency.charAt(0).toUpperCase() + formState.frequency.slice(1)} classes`;
    } else if (formState.durationType === 'fixed') {
      frequency = `${formState.totalSessions || 0} sessions`;
    } else {
      frequency = 'Weekly classes';
    }
    
    return `${frequency} starting ${startDate}`;
  };

  const formatTimeSlots = () => {
    if (formState.timeSlots.length === 0) return 'No time slots set';
    
    return formState.timeSlots.map(slot => 
      `${slot.day.charAt(0).toUpperCase() + slot.day.slice(1)}s, ${slot.startTime} - ${slot.endTime}`
    ).join(', ');
  };

  const formatPrice = () => {
    if (!formState.price || formState.price === 0) return 'Free';
    const currencySymbol = formState.currency === 'USD' ? '$' : formState.currency;
    const interval = formState.durationType === 'recurring' ? '/month' : '';
    return `${currencySymbol}${formState.price}${interval}`;
  };

  const getConnectionDetails = () => {
    if (formState.deliveryMode === 'online') {
      if (formState.classFormat === 'recorded') {
        return {
          type: 'Recorded Class',
          detail: 'Videos will be available to enrolled students'
        };
      } else {
        return {
          type: 'Meeting Link',
          detail: formState.meetingLink || 'Not set'
        };
      }
    } else {
      const address = formState.address;
      if (address.street || address.city) {
        return {
          type: formState.classFormat === 'inbound' ? 'Student Location' : 'Teaching Location',
          detail: `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`
        };
      }
      return {
        type: 'Location',
        detail: 'Address not set'
      };
    }
  };

  const connectionDetails = getConnectionDetails();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#1F4E79] mb-2">Class Preview</h2>
        <Badge variant="outline" className="text-sm">
          Draft
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Class Preview */}
        <div className="space-y-4">
          {/* Class Image Placeholder */}
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            {formState.thumbnailUrl ? (
              <img 
                src={formState.thumbnailUrl} 
                alt="Class thumbnail" 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <p className="text-gray-500">No thumbnail uploaded</p>
            )}
          </div>

          {/* Class Title and Type */}
          <div>
            <h3 className="text-xl font-semibold mb-2">
              {formState.title || 'Untitled Class'}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{formatClassType()}</p>
            <Badge variant="secondary" className="text-xs">
              {formState.subject || 'No subject'}
            </Badge>
          </div>

          {/* Description */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {formState.description || 'No description provided'}
              </p>
            </CardContent>
          </Card>

          {/* Syllabus Preview */}
          {formState.syllabus.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Syllabus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {formState.syllabus.map((item, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-3">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Class Details */}
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
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          Back
        </Button>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onSaveAsDraft}
            className="bg-white hover:bg-gray-50"
          >
            Save as Draft
          </Button>
          <Button 
            onClick={onPublish}
            className="bg-[#1F4E79] hover:bg-[#1a4369]"
          >
            Publish Now
          </Button>
        </div>
      </div>

      {/* Next Steps Information */}
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="text-base text-[#1F4E79]">Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#1F4E79] text-white text-xs flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <p className="font-medium text-sm">Save as Draft</p>
                <p className="text-xs text-gray-600">Your class will be saved privately and you can edit it later before publishing.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#1F4E79] text-white text-xs flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <p className="font-medium text-sm">Publish Now</p>
                <p className="text-xs text-gray-600">Your class will be immediately visible and students can start enrolling.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviewStep;
