// // app/(chat)/chat/[astroId]/page.tsx
// "use client"

// import React, { useState } from 'react';
// import ChatSidebar from '@/components/ChatSidebar';
// import { useAuthStore } from '@/store/Auth';
// import Navbar from '@/components/Navbar';
// import ChatRoomForSidebar from '@/components/ChatRoomForSidebar';
// import { useParams } from 'next/navigation';
// import toast from 'react-hot-toast';

// const ChatPageForSidebar: React.FC = () => {
//   const { user } = useAuthStore();
//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
//   const {astroId} = useParams();
//   if (!user) {
//     return <div>Please log in to access the chat.</div>;
//   }
//   {user.$id} {astroId}

 
//   const handleSelectUser = () => {
//     setSelectedUserId(user.$id);
//   };

//   return (
//     <div className="flex flex-col h-screen">
//       <Navbar />
//       <div className="flex flex-1 overflow-hidden">
//         <ChatSidebar onSelectUser={handleSelectUser} />
//         <div className="flex-1">
//           {selectedUserId ? (
//             <ChatRoomForSidebar senderId={user.$id} receiverId={selectedUserId} />
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

export default function ChatPageForSidebar() {
  return <div>
    Chatpageforsidebar
  </div>
}