
import React, { useRef, useEffect } from 'react';
import { User, Phone, Home, GraduationCap, CreditCard } from 'lucide-react';

interface ProfileDropdownProps {
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div className="px-6 py-5">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white text-lg font-medium">
            T
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-800">John Doe</h3>
            <p className="text-sm text-gray-500">Math & Science Tutor</p>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-start">
            <User className="h-5 w-5 text-gray-500 mt-0.5" />
            <div className="ml-3">
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="text-sm font-medium">John Doe</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
            <div className="ml-3">
              <p className="text-xs text-gray-500">Contact Number</p>
              <p className="text-sm font-medium">+91 9876543210</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Home className="h-5 w-5 text-gray-500 mt-0.5" />
            <div className="ml-3">
              <p className="text-xs text-gray-500">Address</p>
              <p className="text-sm font-medium">123 Education St, Bangalore</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <GraduationCap className="h-5 w-5 text-gray-500 mt-0.5" />
            <div className="ml-3">
              <p className="text-xs text-gray-500">Qualification</p>
              <p className="text-sm font-medium">M.Sc. Mathematics, B.Ed</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
            <div className="ml-3">
              <p className="text-xs text-gray-500">Bank Account</p>
              <p className="text-sm font-medium">HDFC Bank •••• 3456</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-md text-sm font-medium transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
