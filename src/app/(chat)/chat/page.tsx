"use client";

import React, { useEffect, useState } from "react";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { AppwriteException, Query } from "appwrite";
import { database } from "@/appwrite/clientConfig";
import conf from "@/conf/conf";
import { useAuthStore } from "@/store/Auth";
import Navbar from "@/components/Navbar";

interface Astrologer {
  $id: string;
  user_id: string;
  name: string;
  photoUrl: string;
  rating: number;
  experience: number;
  hourlyRate: number;
  language: string[];
  isOnline: boolean;
}

const AstrologerCard: React.FC<{
  astrologer: Astrologer;
  onChatClick: (id: string) => void;
}> = ({ astrologer, onChatClick }) => (
  <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-sm hover:shadow-lg transition-shadow">
    <div className="flex items-center space-x-4">
      <Image
        height={80}
        width={80}
        src={astrologer.photoUrl || "/default-avatar.png"}
        alt={astrologer.name}
      />
      {/* <img
        src={astrologer.photoUrl || '/default-avatar.png'}
        alt={astrologer.name}
        className="w-16 h-16 rounded-full object-cover"
      /> */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{astrologer.name}</h3>
        <div className="text-sm text-gray-600">
          <p>
            ⭐ {astrologer.rating.toFixed(1)} • {astrologer.experience} yrs
          </p>
          <p>${astrologer.hourlyRate}/hr</p>
        </div>
      </div>
      <div
        className={`w-3 h-3 rounded-full ${astrologer.isOnline ? "bg-green-500" : "bg-gray-400"}`}
      />
    </div>
    <div className="mt-3 flex justify-end">
      <button
        onClick={() => onChatClick(astrologer.$id)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
      >
        Chat Now
      </button>
    </div>
  </div>
);

const ChatPage: React.FC = () => {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        const response = await database.listDocuments(
          conf.appwriteHoroscopeDatabaseId,
          conf.appwriteAstroCollectionId,
          [Query.equal("isOnline", true)],
        );
        setAstrologers(response.documents as unknown as Astrologer[]);
      } catch (err) {
        setError(
          err instanceof AppwriteException
            ? `${err.message} (Code: ${err.code})`
            : "Failed to fetch astrologers",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAstrologers();
  }, []);

  const handleChatClick = (astrologerId: string) => {
    if (!user?.$id) {
      router.push("/login");
      return;
    }
    router.push(`/chat/${astrologerId}/${user.$id}`);
  };

  const filteredAstrologers = astrologers.filter((astrologer) =>
    astrologer.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!astrologers.length)
    return <div className="text-center py-8">No astrologers available.</div>;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Chat with Astrologers
        </h1>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md mx-auto mb-6 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAstrologers.map((astrologer) => (
            <AstrologerCard
              key={astrologer.$id}
              astrologer={astrologer}
              onChatClick={handleChatClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
