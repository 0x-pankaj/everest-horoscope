"use client"
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaComments, FaHeadset, FaStar, FaClock } from 'react-icons/fa';

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onButtonClick: () => void;
  features: string[];
}

const Card: React.FC<CardProps> = ({ title, description, icon, buttonText, onButtonClick, features }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4 mx-auto">
          <div className="text-3xl">{icon}</div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 text-center mb-6">{description}</p>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-600">
              <FaStar className="text-yellow-400 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
        <button
          onClick={onButtonClick}
          className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300 text-lg font-semibold"
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
    router.push("/admin-member");
  };

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Choose Your Consultation Method</h1>
        <p className="text-xl text-center text-gray-600 mb-12">Get personalized insights or support from our experts</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card
            title="Chat with Astrologer"
            description="Connect with our expert astrologers for personalized insights and guidance."
            icon={<FaComments />}
            buttonText="Start Astro Chat"
            onButtonClick={handleChatWithAstrologer}
            features={[
              "Personalized horoscope readings",
              "Guidance on life decisions",
              "Relationship compatibility analysis"
            ]}
          />
          <Card
            title="Chat with Representative"
            description="Reach out to our friendly support team for any queries or assistance."
            icon={<FaHeadset />}
            buttonText="Contact Support"
            onButtonClick={handleChatWithRepresentative}
            features={[
              "Quick response to your queries",
              "Help with account-related issues",
              "General information and guidance"
            ]}
          />
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-600 flex items-center justify-center">
            <FaClock className="mr-2" /> Our experts are available 24/7 to assist you
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatOptions;