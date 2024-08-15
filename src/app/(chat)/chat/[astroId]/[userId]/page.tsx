'use client';
//path /[astroId]/[userId]
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatRoom from '@/components/ChatRoom';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuthStore } from '@/store/Auth';

export default function ChatRoomPage({
  params,
}: {
  params: { astroId: string; userId: string };
}) {
  const router = useRouter();
  const { user } = useAuthStore();

  if (!user) {
    // Handle unauthenticated user
    return <div>Please log in to access the chat.</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Chat with astrologers </h1>
            <div className="w-6"> {user.name} </div> {/* Placeholder for alignment */}
          </div>
        </div>   
      </div>

      <div className="flex-grow">
        <div className="max-w-7xl mx-auto h-full">
          <ChatRoom senderId={user.$id} receiverId={params.astroId} />
        </div>
      </div>
    </div>
  );
}
