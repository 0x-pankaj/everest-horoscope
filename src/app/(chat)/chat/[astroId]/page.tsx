// (chat)/chat/[astroId]/page.tsx
"use client";

import React, { useState } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import { useAuthStore } from "@/store/Auth";
import Navbar from "@/components/Navbar";
import ChatRoom from "@/components/ChatRoom";
import { FaBars, FaTimes } from "react-icons/fa";

const ChatPageForSidebar = ({ params }: { params: { astroId: string } }) => {
  const { user, hydrated } = useAuthStore();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!hydrated || !user) {
    return <div>Loading...</div>;
  }

  const handleSelectUser = (id: string) => {
    console.log("id on click: ", id);
    setSelectedUserId(id);
    // setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-dvh">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed lg:static z-20 inset-y-0 left-0 w-64 lg:w-1/4 bg-gray-200 transform lg:transform-none transition-transform duration-200 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 flex flex-col`}
        >
          <div className="flex justify-between items-center p-4 lg:hidden">
            <h2 className="text-xl font-semibold">Chats</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <FaTimes size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChatSidebar onSelectUser={handleSelectUser} />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col relative">
          {/* Hamburger menu for mobile */}
          <div className="lg:hidden absolute top-2 left-2 z-10  ">
            {/* <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 bg-gray-200 rounded-md"
              >
              <FaBars size={24} />
              </button> */}
          </div>
          {/* {selectedUserId} */}

          {selectedUserId ? (
            <ChatRoom
              key={selectedUserId}
              senderId={params.astroId}
              receiverId={selectedUserId}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPageForSidebar;
