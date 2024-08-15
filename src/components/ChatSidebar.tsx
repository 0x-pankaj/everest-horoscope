// // components/ChatSidebar.tsx
// import React, { useEffect, useState } from 'react';
// import { useChatStore } from '@/store/chatStore';
// import { useAuthStore } from '@/store/Auth';
// import { database } from '@/appwrite/clientConfig';
// import conf from '@/conf/conf';

// interface ChatUser {
//   userId: string;
//   name: string;
// }

// const ChatSidebar: React.FC<{ onSelectUser: (userId: string) => void }> = ({ onSelectUser }) => {
//   const { chattedUsers, setChattedUsers } = useChatStore();
//   const { user } = useAuthStore();
//   const [users, setUsers] = useState<ChatUser[]>([]);

//   if(!user) return

//   useEffect(() => {
//     setChattedUsers(user?.$id);
//   }, [setChattedUsers]);

//   useEffect(() => {
//     const fetchUserNames = async () => {
//       const userIds = chattedUsers.map(user => user.userId).filter(id => id !== user?.$id);
//       const uniqueUserIds = Array.from(new Set(userIds));

//       const userPromises = uniqueUserIds.map(async (userId) => {
//         try {
//           const response = await database.getDocument(conf.appwriteHoroscopeDatabaseId, conf.appwriteAstroCollectionId, userId);
//           return { userId, name: response.name };
//         } catch (error) {
//           console.error(`Error fetching user ${userId}:`, error);
//           return { userId, name: 'Unknown User' };
//         }
//       });

//       const resolvedUsers = await Promise.all(userPromises);
//       setUsers(resolvedUsers);
//     };

//     if (chattedUsers.length > 0) {
//       fetchUserNames();
//     }
//   }, [chattedUsers, user]);

//   return (
//     <div className="w-64 bg-gray-100 h-full overflow-y-auto">
//       <h2 className="text-xl font-semibold p-4">Chats</h2>
//       <ul>
//         {users.map((chatUser) => (
//           <li key={chatUser.userId}>
//             <button 
//               className="w-full text-left p-4 hover:bg-gray-200"
//               onClick={() => onSelectUser(chatUser.userId)}
//             >
//               {chatUser.name}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ChatSidebar;

export default function ChatSidebar() {
    return (
        <div>
            ChatSideBar
        </div>
    )
}