"use client"

import React, { useEffect, useRef, useState } from 'react';
import { useAstroStore } from '@/store/astroStore';
import { useRouter } from 'next/navigation';
import AstrologerProfileCard from '@/components/AstroCard';
import { useAuthStore } from '@/store/Auth';
import Navbar from '@/components/Navbar';
import { AppwriteException } from 'appwrite';

const ChatPage: React.FC = () => {
  const { astrologers, loading, error, fetchAstrologers } = useAstroStore();
  const { user } = useAuthStore();
  const [hasFetched, setHasFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!hasFetched) {
      (async () => {
        try {
          await fetchAstrologers();
        } catch (err) {
          console.error("Failed to fetch astrologers:", err);
        } finally {
          setHasFetched(true);
        }
      })();
    }
  }, [fetchAstrologers, hasFetched]);

  const handleChatClick = (astrologerId: string) => {
    router.push(`/chat/${astrologerId}/${user?.$id}`);
  };

  const filteredAstrologers = astrologers.filter(
    (astrologer) =>
      astrologer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      astrologer.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  if (loading && !hasFetched) return <div >Loading...</div>;
  if (error) {
    console.error("Error:", error);
    return (
      <div>
        Error: {error instanceof AppwriteException 
          ? `${error.message || "Unknown Appwrite error"} (Code: ${error.code})`
          : "An unknown error occurred"}
        <button onClick={() => { setHasFetched(false); }}>Retry</button>
      </div>
    );
  }
  if (astrologers.length === 0) return <div>No astrologers found.</div>;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Chat with Astrologers</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or specialty"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="grid grid-cols-1 justify-items-center md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAstrologers.map((astrologer) => (
            <AstrologerProfileCard
              key={astrologer.$id}
              id={astrologer.$id}
              user_id={astrologer.user_id}
              name={astrologer.name}
              photoUrl={astrologer.photoUrl}
              bio={astrologer.bio}
              specialties={astrologer?.specialties}
              rating={astrologer.rating}
              experience={astrologer.experience}
              hourlyRate={astrologer.hourlyRate}
              isOnline={astrologer.isOnline}
              onChatClick={handleChatClick}
              language={astrologer?.language}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
