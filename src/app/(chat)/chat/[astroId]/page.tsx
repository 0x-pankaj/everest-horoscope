"use client"

import React, { useState } from 'react';
import ChatSidebar from '@/components/ChatSidebar';
import { useAuthStore } from '@/store/Auth';
import Navbar from '@/components/Navbar';
import ChatRoom from '@/components/ChatRoom';
import { FaBars } from 'react-icons/fa';

const ChatPageForSidebar = ({
  params,
}: {
  params: { astroId: string };
}) => {
  const { user, hydrated } = useAuthStore();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!hydrated || !user) {
    return <div>Loading...</div>;
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setSidebarOpen(false); // Close sidebar on user selection
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Hamburger menu for mobile */}
        <div className="lg:hidden p-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars size={24} />
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed lg:static z-20 inset-y-0 left-0 transform lg:transform-none transition-transform duration-200 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:flex lg:w-1/4 bg-gray-200 p-4 overflow-y-auto`}
        >
          <ChatSidebar onSelectUser={handleSelectUser} />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {selectedUserId ? (
            <ChatRoom senderId={params.astroId} receiverId={selectedUserId} />
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


// import React, { useEffect, useState } from 'react';
// import ChatSidebar from '@/components/ChatSidebar';
// import { useAuthStore } from '@/store/Auth';
// import Navbar from '@/components/Navbar';
// import ChatRoom from '@/components/ChatRoom';
// import toast from 'react-hot-toast';
// import { useRouter } from 'next/navigation';

// const ChatPageForSidebar = ({
//   params,
// }: {
//   params: { astroId: string };
// }) => {
//   const { user, hydrated } = useAuthStore();
//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
//   const router = useRouter();



// /*
//   useEffect(() => {
//     if (hydrated) {
//       if (!user) {
//         toast.error("Please log in to access the chat.");
//         router.push("/login");
//       } else if (params.astroId !== user.$id) {
//         toast.error("Unauthorized access");
//         router.push("/chat");
//       }
//     }
//   }, [hydrated, user, params.astroId, router]);
// */
//   if (!hydrated || !user) {
//     return <div>Loading...</div>;
//   }

//   const handleSelectUser = (userId: string) => {
//     setSelectedUserId(userId);
//   };


//   return (
//     <div className="flex flex-col h-screen">
//       <Navbar />
//       <div className="flex flex-1 overflow-hidden">
//         <ChatSidebar onSelectUser={handleSelectUser} />
//         <div className="flex-1">
//           {selectedUserId ? (
//             <ChatRoom senderId={params.astroId} receiverId={selectedUserId} />
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <p>Select a chat to start messaging</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPageForSidebar;