import React from 'react';
import Image from "next/legacy/image";
import Link from 'next/link';

interface AstroCardProps {
  id: string;
  name: string;
  photoUrl: string;
  speciality: string;
  experience: number;
}

const AstroCard: React.FC<AstroCardProps> = ({ id, name, photoUrl, speciality, experience }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={photoUrl}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 mb-2">{speciality}</p>
        <p className="text-sm text-gray-500 mb-4">{experience} years experience</p>
        <Link href={`/chat/${id}`} legacyBehavior>
          <a className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-300">
            Chat Now
          </a>
        </Link>
      </div>
    </div>
  );
};

export default AstroCard;