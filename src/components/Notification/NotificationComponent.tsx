import React, { useEffect, useState } from "react";
import { Models, ID } from "appwrite";
import { useAuthStore } from "@/store/Auth";
import toast from "react-hot-toast";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { client, database } from "@/appwrite/clientConfig";
import conf from "@/conf/conf";
import { useRoleAccess } from "@/hooks/useRoleAccess";

// Initialize Appwrite

interface Message {
  $id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  name: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  is_temp: boolean;
  original_body?: string;
  created_at: string; // Add this for timestamp
}

const NotificationComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const { isTranslator } = useRoleAccess();

  useEffect(() => {
    if (!user?.$id) return;

    // Fetch existing notifications
    // const fetchNotifications = async () => {
    //   try {
    //     const response = await databases.listDocuments(
    //       process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    //       'message_with_astro',
    //       [
    //         // Query for messages where receiver_id matches user.id and is_temp is false
    //         databases.createQuery()
    //           .equal('receiver_id', user.id)
    //           .equal('is_temp', false)
    //           .orderDesc('$createdAt')
    //           .limit(20)
    //       ]
    //     );

    //     setNotifications(response.documents as Message[]);
    //     setUnreadCount(response.documents.length);
    //   } catch (error) {
    //     console.error('Error fetching notifications:', error);
    //     toast.error('Failed to load notifications');
    //   }
    // };

    // fetchNotifications();

    // Subscribe to realtime updates

    let collectionIdUrl = "";

    if (isTranslator()) {
      collectionIdUrl = `databases.${conf.appwriteHoroscopeDatabaseId}.collections.${conf.appwriteMessageWithTranslatorCollectionId}.documents`;
    } else {
      collectionIdUrl = `databases.${conf.appwriteHoroscopeDatabaseId}.collections.${conf.appwriteMessageCollectionId}.documents`;
    }

    const unsubscribe = client.subscribe(
      `databases.${conf.appwriteHoroscopeDatabaseId}.collections.${conf.appwriteMessageCollectionId}.documents`,

      (response) => {
        console.log("response from notification realtime: ", response);

        const payload = response.payload as Models.Document;
        console.log("notificationPayload: ", payload);
        console.log(
          "sender: ",
          payload.sender_id,
          "receiver: ",
          payload.receiver_id,
        );

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create",
          )
        ) {
          if (payload.is_temp === false && user.$id === payload.receiver_id) {
            const newMessage = payload as unknown as Message;
            console.log("message added: ", newMessage);

            setNotifications((prev) => [newMessage, ...prev]);
            setUnreadCount((prev) => prev + 1);

            // Show toast notification
            toast.custom((t) => (
              <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-4">
                <Bell className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="font-medium">{newMessage.name}</p>
                  <p className="text-sm text-gray-600">{newMessage.body}</p>
                </div>
              </div>
            ));
          }
        }

        // // Handle new messages
        // if (event === "databases.*.collections.*.documents.*.create") {
        //   const newMessage = payload as Message;
        //   console.log("newMessage : ", newMessage);

        //   // Check if the message is for the current user and is not temporary
        //   if (newMessage.receiver_id === user.$id && !newMessage.is_temp) {
        //     setNotifications((prev) => [newMessage, ...prev]);
        //     setUnreadCount((prev) => prev + 1);

        //     // Show toast notification
        //     toast.custom((t) => (
        //       <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-4">
        //         <Bell className="h-6 w-6 text-blue-500" />
        //         <div>
        //           <p className="font-medium">{newMessage.name}</p>
        //           <p className="text-sm text-gray-600">{newMessage.body}</p>
        //         </div>
        //       </div>
        //     ));
        //   }
        // }
      },
    );

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, [user?.$id]);

  const handleNotificationClick = () => {
    setUnreadCount(0);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          onClick={handleNotificationClick}
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.$id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-2">
                    <div className="flex-1">
                      <p className="font-medium">{notification.name}</p>
                      <p className="text-sm text-gray-600">
                        {notification.body}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTimestamp(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationComponent;
