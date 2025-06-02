import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  CreditCard, 
  Shield, 
  AlertTriangle, 
  Upload,
  Edit,
  Eye,
  EyeOff 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl 
} from "@/components/ui/form";

const countries = [
  { value: "usa", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "australia", label: "Australia" },
  { value: "india", label: "India" },
];

const statesByCountry = {
  usa: [
    { value: "ca", label: "California" },
    { value: "ny", label: "New York" },
    { value: "tx", label: "Texas" },
    { value: "fl", label: "Florida" },
  ],
  canada: [
    { value: "on", label: "Ontario" },
    { value: "bc", label: "British Columbia" },
    { value: "qc", label: "Quebec" },
  ],
  uk: [
    { value: "eng", label: "England" },
    { value: "sct", label: "Scotland" },
    { value: "wls", label: "Wales" },
  ],
  australia: [
    { value: "nsw", label: "New South Wales" },
    { value: "qld", label: "Queensland" },
    { value: "vic", label: "Victoria" },
  ],
  india: [
    { value: "mh", label: "Maharashtra" },
    { value: "dl", label: "Delhi" },
    { value: "ka", label: "Karnataka" },
  ],
};

const Profile = () => {
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    name: "John Smith",
    email: "john.smith@example.com",
    age: "25",
    country: "usa",
    state: "ca",
    city: "San Francisco",
    pincode: "94103",
    address: "123 Main St",
  });
  
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailUpdates: true,
    upcomingClasses: true,
    newFeatures: false,
    promotions: false,
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [uploadPhotoDialogOpen, setUploadPhotoDialogOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [addPaymentMethodDialogOpen, setAddPaymentMethodDialogOpen] = useState(false);
  
  const [paymentMethods, setPaymentMethods] = useState<Array<{ type: string; last4: string; expiry: string }>>([]);
  const [newCardData, setNewCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: ""
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };
  
  const handleCountryChange = (value: string) => {
    setProfileData({
      ...profileData,
      country: value,
      state: statesByCountry[value as keyof typeof statesByCountry][0].value,
    });
  };
  
  const handleStateChange = (value: string) => {
    setProfileData({
      ...profileData,
      state: value,
    });
  };
  
  const handleNotificationChange = (name: string, value: boolean) => {
    setNotificationPreferences({
      ...notificationPreferences,
      [name]: value,
    });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };
  
  const handleUploadPhoto = (type: string) => {
    // In a real app, we would handle the photo upload here
    setUploadPhotoDialogOpen(false);
    
    setConfirmationMessage("Profile photo has been uploaded successfully.");
    setConfirmationModalOpen(true);
    
    setTimeout(() => {
      setConfirmationModalOpen(false);
    }, 5000);
  };
  
  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully."
    });
  };
  
  const handleAddPaymentMethod = () => {
    // In a real app, we would process the payment information here
    setPaymentMethods([
      ...paymentMethods,
      {
        type: "Visa",
        last4: newCardData.cardNumber.slice(-4),
        expiry: newCardData.expiry
      }
    ]);
    
    setAddPaymentMethodDialogOpen(false);
    
    setConfirmationMessage("Your new payment method has been added successfully.");
    setConfirmationModalOpen(true);
    
    setTimeout(() => {
      setConfirmationModalOpen(false);
    }, 5000);
    
    // Reset form
    setNewCardData({
      cardNumber: "",
      expiry: "",
      cvc: "",
      name: ""
    });
  };
  
  const handleSavePreferences = () => {
    setConfirmationMessage("Your preferences have been saved successfully.");
    setConfirmationModalOpen(true);
    
    setTimeout(() => {
      setConfirmationModalOpen(false);
    }, 5000);
  };
  
  const handleChangePassword = () => {
    toast({
      title: "Password changed",
      description: "Your password has been changed successfully."
    });
    
    setPasswordData({
      currentPassword: "",
      newPassword: ""
    });
  };
  
  const handleSignOutAllDevices = () => {
    toast({
      title: "Signed out from all devices",
      description: "You have been signed out from all devices. Redirecting to login..."
    });
    
    // In a real app, we would redirect to login after a timeout
    setTimeout(() => {
      // navigate("/login");
    }, 5000);
  };
  
  const handleDeactivateAccount = () => {
    const confirm = window.confirm(
      "Are you sure you want to deactivate your account? You will lose access to all your classes and progress."
    );
    
    if (confirm) {
      toast({
        title: "Account deactivated",
        description: "Your account has been deactivated.",
        variant: "destructive",
      });
      
      // In a real app, we would redirect to login after account deactivation
      setTimeout(() => {
        // navigate("/login");
      }, 5000);
    }
  };
  
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* Profile Details Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>
                Update your profile information here. Accurate information is required for offline classes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-[#8A5BB7] flex items-center justify-center text-white text-2xl">
                    {profileData.name ? (
                      profileData.name.charAt(0)
                    ) : (
                      <User className="h-12 w-12" />
                    )}
                  </div>
                  <Button 
                    size="icon"
                    variant="outline" 
                    className="absolute bottom-0 right-0 rounded-full bg-white hover:bg-[#E5D0FF] border border-gray-300"
                    onClick={() => setUploadPhotoDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={() => setUploadPhotoDialogOpen(true)}
                  className="mt-4 bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Picture
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={profileData.age}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select 
                    value={profileData.country} 
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select 
                    value={profileData.state} 
                    onValueChange={handleStateChange}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {profileData.country && statesByCountry[profileData.country as keyof typeof statesByCountry]?.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={profileData.city}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={profileData.pincode}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Complete Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveProfile}
                  className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
                >
                  Save Changes
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                {paymentMethods.length > 0 ? (
                  <div className="space-y-3">
                    {paymentMethods.map((method, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                          <CreditCard className="mr-2 h-5 w-5 text-[#8A5BB7]" />
                          <span>{method.type} •••• {method.last4} (expires {method.expiry})</span>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-start mt-3">
                      <Button 
                        onClick={() => setAddPaymentMethodDialogOpen(true)} 
                        variant="outline"
                      >
                        Add New Method
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">No payment methods added</p>
                    <Button 
                      onClick={() => setAddPaymentMethodDialogOpen(true)} 
                      variant="outline"
                    >
                      Add New Method
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Preferences Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-updates">Email Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about your account activity.
                    </p>
                  </div>
                  <Switch
                    id="email-updates"
                    checked={notificationPreferences.emailUpdates}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("emailUpdates", checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="upcoming-classes">Upcoming Classes</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified before your scheduled classes.
                    </p>
                  </div>
                  <Switch
                    id="upcoming-classes"
                    checked={notificationPreferences.upcomingClasses}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("upcomingClasses", checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-features">New Features</Label>
                    <p className="text-sm text-muted-foreground">
                      Learn about new features and improvements.
                    </p>
                  </div>
                  <Switch
                    id="new-features"
                    checked={notificationPreferences.newFeatures}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("newFeatures", checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="promotions">Promotions</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about promotions and discounts.
                    </p>
                  </div>
                  <Switch
                    id="promotions"
                    checked={notificationPreferences.promotions}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("promotions", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleSavePreferences}
                className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
              >
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Security Details Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Details</CardTitle>
              <CardDescription>
                Manage your password and account security.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input 
                          id="current-password" 
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"} 
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input 
                          id="new-password" 
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"} 
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={handleChangePassword}
                    className="mt-2 bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
                  >
                    Update Password
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-base font-medium mb-2">Active Sessions</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between pb-2 border-b">
                      <div>
                        <p className="font-medium">New York, USA</p>
                        <p className="text-sm text-gray-500">Chrome on Windows</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Current</Badge>
                    </div>
                    <div className="flex justify-between pb-2 border-b">
                      <div>
                        <p className="font-medium">San Francisco, USA</p>
                        <p className="text-sm text-gray-500">Safari on macOS</p>
                      </div>
                      <Badge className="bg-gray-100 text-gray-800">Active</Badge>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleSignOutAllDevices}
                    className="w-full"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Sign Out From All Devices
                  </Button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col">
              <div className="w-full pt-4 border-t">
                <div className="space-y-2">
                  <h3 className="text-base font-medium text-red-600">Deactivate Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Once you deactivate your account, you will lose access to all your classes and progress.
                  </p>
                  <div className="flex justify-start">
                    <Button 
                      variant="destructive" 
                      onClick={handleDeactivateAccount}
                      className="flex items-center"
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Deactivate Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Upload Photo Dialog */}
      <Dialog open={uploadPhotoDialogOpen} onOpenChange={setUploadPhotoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Profile Picture</DialogTitle>
            <DialogDescription>
              Choose how you want to upload your profile picture
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleUploadPhoto("device")}
              className="h-20 flex flex-col items-center justify-center bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
            >
              <Upload className="h-6 w-6 mb-2" />
              Upload from Device
            </Button>
            <Button
              onClick={() => handleUploadPhoto("camera")}
              className="h-20 flex flex-col items-center justify-center bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
            >
              <CreditCard className="h-6 w-6 mb-2" />
              Take a Photo
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadPhotoDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Payment Method Dialog */}
      <Dialog open={addPaymentMethodDialogOpen} onOpenChange={setAddPaymentMethodDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add payment method</DialogTitle>
            <DialogDescription>
              Note: Some payment providers issue a temporary authorization charge.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9123 4567"
                value={newCardData.cardNumber}
                onChange={(e) => setNewCardData({ ...newCardData, cardNumber: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiration</Label>
                <Input
                  id="expiry"
                  placeholder="MM / YY"
                  value={newCardData.expiry}
                  onChange={(e) => setNewCardData({ ...newCardData, expiry: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="•••"
                  value={newCardData.cvc}
                  onChange={(e) => setNewCardData({ ...newCardData, cvc: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-name">Cardholder Name</Label>
              <Input
                id="card-name"
                placeholder="John Johnson"
                value={newCardData.name}
                onChange={(e) => setNewCardData({ ...newCardData, name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setAddPaymentMethodDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPaymentMethod} className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90">
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Modal */}
      <Dialog open={confirmationModalOpen} onOpenChange={setConfirmationModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-6 text-center">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p>{confirmationMessage}</p>
          </div>
          <DialogFooter>
            <Button 
              className="w-full bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
              onClick={() => setConfirmationModalOpen(false)}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Helper Badge component for this page
const Badge = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${className}`}>
      {children}
    </span>
  );
};

export default Profile;
