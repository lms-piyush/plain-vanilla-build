
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClassCreationStore } from "@/hooks/use-class-creation-store";
import PublishConfirmationModal from "../PublishConfirmationModal";
import ClassPreviewCard from "../ClassPreviewCard";
import ClassDetailsCard from "../ClassDetailsCard";

interface PreviewStepProps {
  onBack: () => void;
  onSaveAsDraft: () => void;
  onPublish: () => void;
  isPublishing?: boolean;
  editingClass?: boolean;
}

const PreviewStep = ({ onBack, onSaveAsDraft, onPublish, isPublishing = false, editingClass = false }: PreviewStepProps) => {
  const store = useClassCreationStore();
  const [showPublishModal, setShowPublishModal] = useState(false);

  const handlePublishClick = () => {
    setShowPublishModal(true);
  };

  const handleConfirmPublish = () => {
    setShowPublishModal(false);
    onPublish();
  };

  const formatClassType = () => {
    const parts = [];
    if (store.deliveryMode) parts.push(store.deliveryMode === 'online' ? 'Online' : 'Offline');
    if (store.classFormat) parts.push(store.classFormat.charAt(0).toUpperCase() + store.classFormat.slice(1));
    if (store.classSize) parts.push(store.classSize === 'one-on-one' ? 'One-on-One' : 'Group');
    return parts.join(' ');
  };

  const formatSchedule = () => {
    if (!store.startDate) return 'No schedule set';
    
    const startDate = new Date(store.startDate).toLocaleDateString();
    let frequency = '';
    
    if (store.durationType === 'recurring' && store.frequency) {
      frequency = `${store.frequency.charAt(0).toUpperCase() + store.frequency.slice(1)} classes`;
    } else if (store.durationType === 'fixed') {
      frequency = `${store.totalSessions || 0} sessions`;
    } else {
      frequency = 'Weekly classes';
    }
    
    return `${frequency} starting ${startDate}`;
  };

  const formatTimeSlots = () => {
    if (store.timeSlots.length === 0) return 'No time slots set';
    
    return store.timeSlots.map(slot => 
      `${slot.dayOfWeek.charAt(0).toUpperCase() + slot.dayOfWeek.slice(1)}s, ${slot.startTime} - ${slot.endTime}`
    ).join(', ');
  };

  const formatPrice = () => {
    if (!store.price || store.price === 0) return 'Free';
    const currencySymbol = store.currency === 'USD' ? '$' : store.currency;
    const interval = store.durationType === 'recurring' ? '/month' : '';
    return `${currencySymbol}${store.price}${interval}`;
  };

  const getConnectionDetails = () => {
    if (store.deliveryMode === 'online') {
      if (store.classFormat === 'recorded') {
        return {
          type: 'Recorded Class',
          detail: 'Videos will be available to enrolled students'
        };
      } else {
        return {
          type: 'Meeting Link',
          detail: store.meetingLink || 'Not set'
        };
      }
    } else {
      const address = store.address;
      if (address.street || address.city) {
        return {
          type: store.classFormat === 'inbound' ? 'Student Location' : 'Teaching Location',
          detail: `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`
        };
      }
      return {
        type: 'Location',
        detail: 'Address not set'
      };
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#1F4E79] mb-2">Class Preview</h2>
        <Badge variant="outline" className="text-sm">
          {editingClass ? 'Editing' : 'Draft'}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Class Preview */}
        <ClassPreviewCard 
          formState={store}
          formatClassType={formatClassType}
        />

        {/* Right Column - Class Details */}
        <ClassDetailsCard
          formState={store}
          formatSchedule={formatSchedule}
          formatTimeSlots={formatTimeSlots}
          formatPrice={formatPrice}
          getConnectionDetails={getConnectionDetails}
        />
      </div>

      {/* Fixed Action Buttons for mobile, relative for desktop */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 md:relative md:bg-transparent md:border-t-0 md:p-0 md:z-auto">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={onBack}
            disabled={isPublishing}
            className="w-20 md:w-auto"
          >
            Back
          </Button>
          
          <div className="flex gap-2 md:gap-3">
            <Button 
              variant="outline" 
              onClick={onSaveAsDraft}
              disabled={isPublishing}
              className="bg-white hover:bg-gray-50 text-xs md:text-sm px-3 md:px-4"
            >
              Save as Draft
            </Button>
            <Button 
              onClick={handlePublishClick}
              disabled={isPublishing}
              className="bg-[#1F4E79] hover:bg-[#1a4369] text-xs md:text-sm px-3 md:px-4"
            >
              {editingClass ? 'Update & Publish' : 'Publish Now'}
            </Button>
          </div>
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

      <PublishConfirmationModal
        open={showPublishModal}
        onOpenChange={setShowPublishModal}
        onConfirm={handleConfirmPublish}
        isPublishing={isPublishing}
        editingClass={editingClass}
      />
    </div>
  );
};

export default PreviewStep;
