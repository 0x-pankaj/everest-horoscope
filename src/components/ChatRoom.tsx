
// components/ChatRoom.tsx
import React from 'react';

interface ChatRoomProps {
  astroId: string;
  userId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ astroId, userId }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 text-white p-4">
        <h1 className="text-2xl font-bold">Chat with Astrologer</h1>
      </header>
      <main className="flex-grow p-4">
        {/* Add your chat interface here */}
        <p>Astrologer ID: {astroId}</p>
        <p>User ID: {userId}</p>
      </main>
    </div>
  );
};

export default ChatRoom;