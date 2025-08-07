import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface AddressInfo {
  name: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (addressInfo: AddressInfo) => void;
  title?: string;
}

const BillingAddressModal = ({ open, onClose, onSubmit, title = "Billing Address Required" }: AddressModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "IN" // Default to India
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.line1 || !formData.city || !formData.state || !formData.postal_code) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const addressInfo: AddressInfo = {
      name: formData.name,
      address: {
        line1: formData.line1,
        ...(formData.line2 && { line2: formData.line2 }),
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country
      }
    };

    onSubmit(addressInfo);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            As per Indian regulations, we need your billing address to process this payment.
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="line1">Address Line 1 *</Label>
            <Input
              id="line1"
              value={formData.line1}
              onChange={(e) => handleInputChange("line1", e.target.value)}
              placeholder="Street address"
              required
            />
          </div>

          <div>
            <Label htmlFor="line2">Address Line 2</Label>
            <Input
              id="line2"
              value={formData.line2}
              onChange={(e) => handleInputChange("line2", e.target.value)}
              placeholder="Apartment, suite, etc. (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="City"
                required
              />
            </div>

            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="State"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postal_code">PIN Code *</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => handleInputChange("postal_code", e.target.value)}
                placeholder="PIN Code"
                required
              />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value="India"
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Continue to Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BillingAddressModal;