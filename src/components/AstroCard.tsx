// components/AstrologerProfileCard.tsx
"use client"

import React from 'react';
import Image from "next/legacy/image";
import { FaStar, FaComments, FaDollarSign } from 'react-icons/fa';

interface AstrologerProfileCardProps {
  id: string;
  user_id: string;
  name: string;
  photoUrl: string;
  bio: string;
  specialties: string[];
  rating: number;
  experience: number;
  hourlyRate: number;
  isOnline: boolean;
  onChatClick: (id: string) => void;
  language?: string[];
}

const AstrologerProfileCard: React.FC<AstrologerProfileCardProps> = ({
  user_id,
  name,
  photoUrl,
  bio,
  specialties,
  rating,
  experience,
  hourlyRate,
  isOnline,
  onChatClick,
  language
}) => {
  return (
    <div className="max-w-sm w-full rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="relative h-20 bg-gradient-to-r from-purple-300 to-indigo-400">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <Image
            className="w-24 h-24 rounded-full border-4 border-white"
            src={photoUrl}
            alt={`${name}'s photo`}
            width={96}
            height={96}
            objectFit="cover"
          />
        </div>
        <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
      </div>
      <div className="pt-16 pb-8 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{name}</h2>
        <div className="flex justify-center items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`h-5 w-5 ${
                i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">({rating})</span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{bio}</p>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Specialties</h3>
          <div className="flex flex-wrap justify-center gap-2">            
            {specialties?.map((specialty, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
              >
                {specialty}
              </span>
            ))}
            
            </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Language</h3>
          <div className="flex flex-wrap justify-center gap-2">            
            {language?.map((lang, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
              >
                {lang}
              </span>
            ))}
            
            </div>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          {experience} years of experience
        </div>
        <div className="text-sm text-gray-600 mb-6 flex items-center justify-center">
          <FaDollarSign className="h-4 w-4 mr-1" />
          {hourlyRate}/hour
        </div>
        <button
          onClick={() => onChatClick(user_id)}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300 flex items-center justify-center"
        >
          <FaComments className="h-5 w-5 mr-2" />
          Start Chat Session
        </button>
      </div>
    </div>
  );
};

export default AstrologerProfileCard;