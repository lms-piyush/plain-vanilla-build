
import React from 'react';
import { Plus } from 'lucide-react';

const Classes = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">My Classes</h1>
        <button className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
          <Plus size={18} className="mr-2" />
          Create New Class
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-500">Manage all your classes here. You currently have 23 classes.</p>
      </div>
    </div>
  );
};

export default Classes;
