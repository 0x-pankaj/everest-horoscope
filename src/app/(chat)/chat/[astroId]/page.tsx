// // app/(chat)/chat/page.tsx
// "use client"

// import React, { useState } from 'react';
// import ChatSidebar from '@/components/ChatSidebar';
// import ChatRoom from '@/components/ChatRoom';
// import { useAuthStore } from '@/store/Auth';
// import Navbar from '@/components/Navbar';

// const ChatPage: React.FC = () => {
//   const { user } = useAuthStore();
//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

//   if (!user) {
//     return <div>Please log in to access the chat.</div>;
//   }

//   const handleSelectUser = (userId: string) => {
//     setSelectedUserId(userId);  
//   };

//   return (
//     <div className="flex flex-col h-screen">
//       <Navbar />
//       <div className="flex flex-1 overflow-hidden">
//         {/* <ChatSidebar onSelectUser={handleSelectUser} /> */}
//         <div className="flex-1">
//           {selectedUserId ? (
//             <ChatRoom senderId={user.$id} receiverId={selectedUserId} />
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

// export default ChatPage;

export default function ChatPageForAStro() {
  return  <div>
    chat page for astro
  </div>
}