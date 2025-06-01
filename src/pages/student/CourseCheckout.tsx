import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { Check, X } from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Sample course data
const courses = {
  course1: {
    id: "course1",
    title: "Introduction to Python",
    tutor: "Dr. Smith",
    price: 49.99,
    mode: "Online",
    format: "Live",
    duration: "8 weeks"
  },
  course2: {
    id: "course2",
    title: "Advanced Mathematics",
    tutor: "Prof. Johnson",
    price: 69.99,
    mode: "Online",
    format: "Recorded",
    duration: "12 weeks"
  },
  course3: {
    id: "course3",
    title: "Web Development",
    tutor: "Sarah Lee",
    price: 59.99,
    mode: "Online",
    format: "Live",
    duration: "10 weeks"
  }
};

// Sample user profile data
const userProfile = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "555-123-4567",
  country: "United States",
  state: "California",
  city: "San Francisco",
  pincode: "94105",
  address: "123 Main Street, Apt 4B",
  paymentMethods: [
    {
      id: "card1",
      type: "Visa",
      lastFour: "4242",
      expiryDate: "12/25"
    }
  ]
};

// Form schema for missing profile information
const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(6, { message: "Phone number must be at least 6 characters" }),
  country: z.string().min(1, { message: "Country is required" }),
  state: z.string().min(1, { message: "State is required" }),
  city: z.string().min(1, { message: "City is required" }),
  pincode: z.string().min(1, { message: "Pincode is required" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
});

// Form schema for new payment method
const paymentMethodSchema = z.object({
  cardNumber: z.string().min(13, { message: "Card number must be at least 13 digits" }),
  cardholderName: z.string().min(2, { message: "Cardholder name is required" }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Please enter a valid expiry date (MM/YY)" }),
  cvv: z.string().min(3, { message: "CVV must be at least 3 digits" }),
});

type CourseId = keyof typeof courses;

const CourseCheckout = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Get course data based on ID from the URL
  const course = id && courses[id as CourseId] ? courses[id as CourseId] : null;
  
  const [profileComplete, setProfileComplete] = useState(true);
  const [missingProfileModal, setMissingProfileModal] = useState(false);
  const [addPaymentModal, setAddPaymentModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    userProfile.paymentMethods.length > 0 ? userProfile.paymentMethods[0].id : ""
  );

  // Form for missing profile information
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: userProfile.fullName,
      email: userProfile.email,
      phone: userProfile.phone,
      country: userProfile.country,
      state: userProfile.state,
      city: userProfile.city,
      pincode: userProfile.pincode,
      address: userProfile.address,
    },
  });

  // Form for new payment method
  const paymentForm = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
    },
  });

  // Handle submit for missing profile information
  const onSaveProfile = (data: z.infer<typeof profileSchema>) => {
    console.log("Profile data:", data);
    setProfileComplete(true);
    setMissingProfileModal(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  // Handle submit for new payment method
  const onAddPayment = (data: z.infer<typeof paymentMethodSchema>) => {
    console.log("Payment data:", data);
    // In a real app, we would send this to the backend
    const newCard = {
      id: `card${userProfile.paymentMethods.length + 1}`,
      type: data.cardNumber.startsWith('4') ? 'Visa' : data.cardNumber.startsWith('5') ? 'Mastercard' : 'Card',
      lastFour: data.cardNumber.slice(-4),
      expiryDate: data.expiryDate
    };
    
    // Add to local state
    userProfile.paymentMethods.push(newCard);
    setSelectedPaymentMethod(newCard.id);
    setAddPaymentModal(false);
    
    toast({
      title: "Payment method added",
      description: "Your new payment method has been added.",
    });
  };

  // Handle purchase button click
  const handlePurchase = () => {
    if (!profileComplete) {
      setMissingProfileModal(true);
      return;
    }
    
    if (!selectedPaymentMethod) {
      toast({
        title: "Payment method required",
        description: "Please select or add a payment method.",
        variant: "destructive",
      });
      return;
    }
    
    // Show success modal
    setSuccessModal(true);
    
    // Auto-close success modal after 6 seconds and redirect
    setTimeout(() => {
      setSuccessModal(false);
      navigate('/my-classes');
    }, 6000);
  };

  if (!course) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] p-6">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate('/explore')} 
            className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
          >
            Back to Explore
          </Button>
        </div>
      </>
    );
  }
  
  return (
    <>
      <div className="container max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-8">Course Checkout</h1>
        
        {/* Course Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Course Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-lg font-medium">{course.title}</p>
                <p className="text-muted-foreground">by {course.tutor}</p>
              </div>
              <div className="space-y-1 md:text-right">
                <p className="text-xl font-bold">${course.price}</p>
                <p className="text-sm text-muted-foreground">{course.mode} • {course.format} • {course.duration}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* User Information Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>We'll use this information for your enrollment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-sm">Full Name</Label>
                <p className="font-medium">{userProfile.fullName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Email Address</Label>
                <p className="font-medium">{userProfile.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Phone Number</Label>
                <p className="font-medium">{userProfile.phone}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Country</Label>
                <p className="font-medium">{userProfile.country}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">State</Label>
                <p className="font-medium">{userProfile.state}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">City</Label>
                <p className="font-medium">{userProfile.city}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Pincode</Label>
                <p className="font-medium">{userProfile.pincode}</p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-muted-foreground text-sm">Address</Label>
                <p className="font-medium">{userProfile.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Payment Method Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Select how you'd like to pay</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userProfile.paymentMethods.length > 0 ? (
              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
                className="space-y-3"
              >
                {userProfile.paymentMethods.map(card => (
                  <div key={card.id} className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value={card.id} id={card.id} />
                    <Label htmlFor={card.id} className="flex flex-1 cursor-pointer">
                      <span className="flex flex-1">
                        <span className="font-medium">{card.type}</span>
                        <span className="ml-2 text-muted-foreground">•••• {card.lastFour}</span>
                      </span>
                      <span className="text-sm text-muted-foreground">Expires {card.expiryDate}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <p className="text-muted-foreground">No payment methods available.</p>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => setAddPaymentModal(true)}
              className="w-full mt-4"
            >
              Add New Payment Method
            </Button>
          </CardContent>
        </Card>
        
        {/* Purchase Button */}
        <div className="flex justify-end">
          <Button 
            size="lg" 
            onClick={handlePurchase} 
            className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90"
          >
            Buy Course (${course.price})
          </Button>
        </div>
        
        {/* Missing Profile Modal */}
        <Dialog open={missingProfileModal} onOpenChange={setMissingProfileModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Complete Your Profile</DialogTitle>
              <DialogDescription>
                Please complete your profile information before proceeding with the course purchase.
              </DialogDescription>
            </DialogHeader>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={profileForm.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setMissingProfileModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90">
                    Save Details
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Add Payment Modal */}
        <Dialog open={addPaymentModal} onOpenChange={setAddPaymentModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Enter your card details to add a new payment method.
              </DialogDescription>
            </DialogHeader>
            <Form {...paymentForm}>
              <form onSubmit={paymentForm.handleSubmit(onAddPayment)} className="space-y-4">
                <FormField
                  control={paymentForm.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1234 5678 9012 3456" 
                          {...field} 
                          onChange={(e) => {
                            // Remove spaces and non-digits
                            const value = e.target.value.replace(/\D/g, '');
                            // Format with spaces every 4 digits
                            const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                            field.onChange(value); // Store raw value
                            e.target.value = formatted; // Display formatted value
                          }}
                          maxLength={19} // 16 digits + 3 spaces
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={paymentForm.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cardholder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={paymentForm.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="MM/YY" 
                            {...field} 
                            onChange={(e) => {
                              // Format as MM/YY
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length > 2) {
                                value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
                              }
                              field.onChange(value);
                              e.target.value = value;
                            }}
                            maxLength={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paymentForm.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123" 
                            type="password"
                            {...field} 
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                              e.target.value = value;
                            }}
                            maxLength={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setAddPaymentModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#8A5BB7] hover:bg-[#8A5BB7]/90">
                    Add Card
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* Success Modal */}
        <Dialog open={successModal} onOpenChange={setSuccessModal}>
          <DialogContent className="sm:max-w-[425px] text-center">
            <div className="py-6 flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <DialogTitle className="text-2xl">Success!</DialogTitle>
              <DialogDescription className="text-center mt-2">
                You've successfully enrolled in the course! We're excited to have you onboard.
              </DialogDescription>
              <p className="text-sm text-muted-foreground mt-6">
                Redirecting to My Classes page...
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default CourseCheckout;
