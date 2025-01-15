"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ChatRoom from "@/components/ChatRoom";
import { FaArrowLeft, FaHome, FaComments } from "react-icons/fa";
import { useAuthStore } from "@/store/Auth";
import VastoForm from "@/components/VastoForm";
import DataFetchButton from "@/components/DataFetchButton";
import FreeCreditManager from "@/components/FreeCreditManager";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { FaCog } from "react-icons/fa";

export default function ChatRoomPage({
  params,
}: {
  params: { astroId: string; userId: string };
}) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { isAdmin, isAstrologer } = useRoleAccess();
  const [showAdminControls, setShowAdminControls] = useState(true);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center p-8 bg-white rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Login Required
          </h2>
          <p className="text-gray-600">
            Please log in to access the chat feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center px-4 py-3">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg
                hover:bg-gray-100 active:bg-gray-200"
            >
              <FaArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/")}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900
                  transition-colors p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200"
              >
                <FaHome className="h-5 w-5" />
                <span className="hidden sm:inline text-sm font-medium">
                  Home
                </span>
              </button>

              <button
                onClick={() => router.push("/chat")}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900
                  transition-colors p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200"
              >
                <FaComments className="h-5 w-5" />
                <span className="hidden sm:inline text-sm font-medium">
                  Chat
                </span>
              </button>
            </div>

            <div className="text-sm font-medium text-gray-700 truncate max-w-[120px] sm:max-w-none">
              {user.name}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow relative">
        <div className="max-w-4xl mx-auto h-full">
          <ChatRoom senderId={user.$id} receiverId={params.astroId} />
        </div>

        {/* Admin/Astrologer Controls */}
        {(isAdmin() || isAstrologer()) && (
          // <div className="fixed bottom-20 right-4 space-y-2 z-10">
          //   <DataFetchButton
          //     userId={params.userId}
          //     // className="shadow-lg hover:shadow-xl transition-shadow"
          //   />
          //   <FreeCreditManager
          //     userId={params.userId}
          //     userName={user.name}
          //     initialPosition={{ x: 200, y: 20 }}
          //     // className="shadow-lg hover:shadow-xl transition-shadow"
          //   />
          // </div>

          <>
            {/* Settings Icon - Always visible */}
            <button
              onClick={() => setShowAdminControls(!showAdminControls)}
              className="fixed bottom-20 left-4 bg-gradient-to-r from-purple-600 to-yellow-500
                 hover:from-purple-700 hover:to-yellow-600 text-white rounded-full p-4 shadow-lg
                 z-20 md:hidden"
            >
              <FaCog className="h-5 w-5" />
            </button>

            {/* Admin Controls - Hidden on mobile when showAdminControls is false */}
            <div
              className={`fixed bottom-20 right-2 space-y-2 z-10
               ${showAdminControls ? "block" : "hidden"}
               md:block`} // md:block ensures it's always visible on desktop
            >
              <DataFetchButton
                userId={params.userId}
                position={{ x: 15, y: 40 }}
              />
              <FreeCreditManager
                userId={params.userId}
                userName={user.name}
                initialPosition={{ x: 200, y: 20 }}
                buttonPosition={{ x: 15, y: 80 }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
