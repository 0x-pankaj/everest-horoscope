// components/AstrologerCard.tsx

import Image from "next/legacy/image";

interface Astrologer {
  $id: string;
  user_id: string;
  name: string;
  photoUrl: string;
  bio: string;
  specialties: string[];
  rating: number;
  experience: number;
  hourlyRate: number;
  isOnline: boolean;
  language: string[];
  totalConsultations?: number;
  satisfactionRate?: number;
}

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/Auth";

interface AstrologerCardProps {
  astrologer: Astrologer;
}

export const AstrologerCard: React.FC<AstrologerCardProps> = ({
  astrologer,
}) => {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.$id) {
      router.push("/login");
      return;
    }
    router.push(`/chat/${astrologer.user_id}/${user.$id}`);
  };

  const handleCardClick = () => {
    router.push(`/astrologers/${astrologer.$id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-all"
    >
      <div className="flex items-start space-x-4">
        <Image
          height={50}
          width={50}
          src={astrologer.photoUrl || "/default-avatar.png"}
          alt={astrologer.name}
          className="w-20 h-20 rounded-full object-cover"
        />

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{astrologer.name}</h3>
            <div
              className={`w-3 h-3 rounded-full ${astrologer.isOnline ? "bg-green-500" : "bg-gray-400"}`}
            />
          </div>
          {/* <div className="text-sm text-gray-600 mt-1">
            <p className="flex items-center">
              <span className="text-yellow-500">⭐</span>
              {astrologer.rating.toFixed(1)} • {astrologer.experience} years
            </p>
            <p className="mt-1">₹{astrologer.hourlyRate}/hr</p>
          </div> */}
          <div className="mt-2">
            <p className="text-sm text-gray-500 line-clamp-2">
              {astrologer.bio}
            </p>
          </div>
          {astrologer.isOnline && (
            <button
              onClick={handleChatClick}
              className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 "
            >
              Chat Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
