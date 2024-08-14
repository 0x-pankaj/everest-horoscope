// import { useEffect, useState } from 'react';
// import { client, database } from '@/appwrite/clientConfig';
// import conf from '@/conf/conf';
// import { Models, Query } from 'appwrite';
// import { useChatStore } from '@/store/chatStore';

// interface UserListProps {
//   astroId: string;
//   onSelectUser: (userId: string, userName: string) => void;
// }

// const UserList: React.FC<UserListProps> = ({ astroId, onSelectUser }) => {
//   const [users, setUsers] = useState<{ userId: string; name: string }[]>([]);
//   const { setChattedUsers } = useChatStore();

//   useEffect(() => {
//     const fetchChattedUsers = async () => {
//       try {
//         const response = await database.listDocuments(
//           conf.appwriteHoroscopeDatabaseId,
//           conf.appwriteMessageCollectionId,
//           [
//             Query.equal('receiver_id', astroId),
//           ]
//         );
//         const userIds = response.documents.map((doc: Models.Document) => doc.sender_id);
//         const uniqueUserIds = Array.from(new Set(userIds));
//         const users = await Promise.all(
//           uniqueUserIds.map(async (userId) => {
//             const userResponse = await database.getDocument(
//               conf.appwriteUserDatabaseId,
//               conf.appwriteUserCollectionId,
//               userId
//             );
//             return { userId, name: userResponse.name };
//           })
//         );
//         setUsers(users);
//         setChattedUsers(users);
//       } catch (error) {
//         console.error('Failed to fetch chatted users', error);
//       }
//     };

//     fetchChattedUsers();
//   }, [astroId, setChattedUsers]);

//   return (
//     <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
//       <h2 className="text-xl font-semibold mb-4">Chatted Users</h2>
//       {users.map((user) => (
//         <div
//           key={user.userId}
//           className="mb-2 p-2 bg-white rounded-lg shadow cursor-pointer"
//           onClick={() => onSelectUser(user.userId, user.name)}
//         >
//           {user.name}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default UserList;
 export default function UserList() {
  return <div>
    userlist
  </div>
 }