
import React from 'react';

const Messages = () => {
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">Messages</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-500">You have 12 unread messages from your students.</p>
      </div>
    </div>
  );
};

export default Messages;
