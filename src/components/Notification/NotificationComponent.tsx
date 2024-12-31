import React, { useEffect, useState } from "react";
import { Models } from "appwrite";
import { useAuthStore } from "@/store/Auth";
import toast from "react-hot-toast";
import { Bell, Volume2, VolumeX } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { client } from "@/appwrite/clientConfig";
import conf from "@/conf/conf";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useRouter } from "next/navigation";

// Sound preferences hook
const useNotificationSound = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("notificationSound");
      return stored === null ? true : stored === "true";
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem("notificationSound", isSoundEnabled.toString());
  }, [isSoundEnabled]);

  return { isSoundEnabled, setIsSoundEnabled };
};

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
  created_at: string;
}

const NotificationComponent: React.FC = () => {
  const [notifications, setNotifications] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const { isTranslator } = useRoleAccess();
  const router = useRouter();
  const { isSoundEnabled, setIsSoundEnabled } = useNotificationSound();

  // Initialize notification sound
  const notificationSound =
    typeof window !== "undefined" ? new Audio("/notification.wav") : null;

  if (notificationSound) {
    notificationSound.preload = "auto";
  }

  // Function to play notification sound
  const playNotificationSound = () => {
    if (isSoundEnabled && notificationSound) {
      notificationSound.currentTime = 0;
      notificationSound.play().catch((error) => {
        console.log("Error playing notification sound:", error);
        if (error.name === "NotAllowedError") {
          toast.error(
            "Please enable sound notifications in your browser settings",
          );
        }
      });
    }
  };

  useEffect(() => {
    if (!user?.$id) return;

    let collectionIdUrl = isTranslator()
      ? `databases.${conf.appwriteHoroscopeDatabaseId}.collections.${conf.appwriteMessageWithTranslatorCollectionId}.documents`
      : `databases.${conf.appwriteHoroscopeDatabaseId}.collections.${conf.appwriteMessageCollectionId}.documents`;

    const unsubscribe = client.subscribe(collectionIdUrl, (response) => {
      console.log("response from notification realtime: ", response);
      const payload = response.payload as Models.Document;

      if (
        response.events.includes("databases.*.collections.*.documents.*.create")
      ) {
        if (payload.is_temp === false && user.$id === payload.receiver_id) {
          const newMessage = payload as unknown as Message;
          console.log("message added: ", newMessage);

          setNotifications((prev) => [newMessage, ...prev]);
          setUnreadCount((prev) => prev + 1);

          // Play notification sound
          playNotificationSound();

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
    });

    return () => {
      unsubscribe();
    };
  }, [user?.$id, isTranslator]);

  const handleNotificationClick = () => {
    setUnreadCount(0);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSoundEnabled(!isSoundEnabled);
    if (!isSoundEnabled) {
      playNotificationSound(); // Play test sound when enabling
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          onClick={handleNotificationClick}
          aria-label="Toggle notifications"
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
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Notifications</h3>
          <button
            onClick={toggleSound}
            className="p-1 hover:bg-gray-100 rounded-full"
            title={
              isSoundEnabled ? "Mute notifications" : "Unmute notifications"
            }
          >
            {isSoundEnabled ? (
              <Volume2 className="h-5 w-5 text-gray-600" />
            ) : (
              <VolumeX className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <button
                  key={notification.$id}
                  className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
                  onClick={() =>
                    router.push(
                      `/chat/${notification.sender_id}/${notification.receiver_id}`,
                    )
                  }
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
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationComponent;
