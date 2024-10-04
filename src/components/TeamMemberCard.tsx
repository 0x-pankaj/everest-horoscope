"use client"
import React from 'react';
import Image from "next/legacy/image";
import { FaComments } from 'react-icons/fa';

interface TeamMemberProps {
  id: string;
  name: string;
  photoUrl: string;
  userId: string;
  onChatClick: (id: string) => void;
}

const TeamMemberCard: React.FC<TeamMemberProps> = ({ id, name, photoUrl, userId, onChatClick }) => {
    const teamMemberId = userId;
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
        priority
          src={photoUrl}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
        <button
          onClick={() => onChatClick(teamMemberId)}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300 flex items-center justify-center"
        >
          <FaComments className="h-5 w-5 mr-2" />
          Start Chat Session
        </button>
      </div>
    </div>
  );
};

export default TeamMemberCard;