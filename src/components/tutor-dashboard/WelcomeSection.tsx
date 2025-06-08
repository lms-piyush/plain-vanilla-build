
import React from 'react';
import { Plus } from 'lucide-react';

interface WelcomeSectionProps {
  onCreateClass: () => void;
}

const WelcomeSection = ({ onCreateClass }: WelcomeSectionProps) => {
  return (
    <div className="bg-primary/10 rounded-lg p-6 mb-6">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Good Evening, Tutor!</h1>
      <p className="text-gray-600 mt-1">Here's what's happening with your teaching journey.</p>
      
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button 
          onClick={onCreateClass}
          className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Create New Class
        </button>
      </div>
    </div>
  );
};

export default WelcomeSection;
