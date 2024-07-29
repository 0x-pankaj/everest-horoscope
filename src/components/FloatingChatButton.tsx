
"use client"

import React, { useState } from 'react';
import Link from 'next/link';

const FloatingChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Assume we have a current user ID and a representative ID
  const currentUserId = 'current-user-id';
  const representativeId = 'rep-id';

  return (
    <div className="fixed bottom-12 right-12 z-50">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl p-4 mb-4 w-80">
          <h3 className="text-lg font-semibold mb-2">Chat with Representative</h3>
          <p className="mb-4">How can we help you today?</p>
          <Link 
            // href={`/chat/${representativeId}/${currentUserId}`}
            href={`/chat`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Start Chat
          </Link>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition duration-300"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default FloatingChatButton;