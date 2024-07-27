"use client"
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaComments, FaPhoneAlt } from 'react-icons/fa';

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onButtonClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, icon, buttonText, onButtonClick }) => {
  return (
    <div className="max-w-xs mx-auto bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <div className="p-4 text-center">
        <div className="flex justify-center items-center mb-4">
          <div className="text-4xl text-indigo-600">{icon}</div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <button
          onClick={onButtonClick}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

const ChatOptions: React.FC = () => {
    const router = useRouter();
  const handleChatWithAstrologer = () => {
    console.log('Initiating chat with astrologer');
    router.push("/chat");
  };

  const handleChatWithRepresentative = () => {
    console.log('Initiating chat with representative');
    // Add your logic to initiate chat with a representative
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card
          title="Chat with Astrologer"
          description="Connect with our expert astrologers for personalized insights and guidance."
          icon={<FaComments />}
          buttonText="Start Chat"
          onButtonClick={handleChatWithAstrologer}
        />
        <Card
          title="Chat with Representative"
          description="Reach out to our friendly support team for any queries or assistance."
          icon={<FaPhoneAlt />}
          buttonText="Start Chat"
          onButtonClick={handleChatWithRepresentative}
        />
      </div>
    </div>
  );
};

export default ChatOptions;
