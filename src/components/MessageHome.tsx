import React, { useEffect, useState } from 'react';
import { Client, Databases, Query } from 'appwrite';
import Link from 'next/link';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';

interface Receiver {
  $id: string;
  user_id: string;
  username: string;
  last_message: string;
}

interface MessageHomeProps {
  senderId: string;
}

const MessageHome: React.FC<MessageHomeProps> = ({ senderId }) => {
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchReceivers = async () => {
      try {
        const response = await database.listDocuments(
          conf.appwriteHoroscopeDatabaseId,
          conf.appwriteMessageCollectionId,
          [
            Query.equal('sender_id', senderId),
            Query.orderDesc('$createdAt'),
            Query.limit(10)
          ]
        );

        const uniqueReceivers = response.documents.reduce((acc: Receiver[], message: any) => {
          if (!acc.some(r => r.user_id === message.receiver_id)) {
            acc.push({
              $id: message.$id,
              user_id: message.receiver_id,
              username: message.receiver_username || 'Unknown',
              last_message: message.body
            });
          }
          return acc;
        }, []);

        setReceivers(uniqueReceivers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching receivers:', error);
        setLoading(false);
      }
    };

    fetchReceivers();
  }, [senderId]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-sm mx-auto">
      <h2 className="text-lg font-semibold bg-gray-100 p-3">Recent Messages</h2>
      <ul className="divide-y divide-gray-200">
        {receivers.map((receiver) => (
          <li key={receiver.$id} className="p-3 hover:bg-gray-50 transition duration-150 ease-in-out">
            <Link href={`/chat/${receiver.user_id}/${senderId}`} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                  {receiver.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {receiver.username}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {receiver.last_message}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {receivers.length === 0 && (
        <p className="text-center p-4 text-gray-500">No recent messages</p>
      )}
    </div>
  );
};

export default MessageHome;