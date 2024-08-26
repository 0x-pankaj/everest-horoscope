import React, { useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useParams } from 'next/navigation';

const ChatSidebar: React.FC<{ onSelectUser: (userId: string) => void }> = ({ onSelectUser }) => {
  const { chattedUsers, setChattedUsers } = useChatStore();
  const { astroId } = useParams();

  useEffect(() => {
    if (astroId) {
      console.log("astroId: ", astroId )
      setChattedUsers(astroId as string);
    }
    console.log("chatted users: ", chattedUsers);
  }, [astroId, setChattedUsers]);

  return (
    <div className="w-full lg:w-64 bg-gray-300 h-full overflow-y-auto">
      <h2 className="text-xl font-semibold p-4">Chats</h2>
      <ul>
        {chattedUsers.map((chatUser) => (
          <li key={chatUser.userId}>
            {/* {chatUser.userId} */}
            <button 
              className="w-full text-left p-4 hover:bg-gray-200"
              onClick={() => {
                console.log("chattedUserId: ", chatUser.userId );
                onSelectUser(chatUser.userId)}
              } 
            >
              {chatUser.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
