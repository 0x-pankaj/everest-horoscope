import { client } from "@/appwrite/clientConfig";
import conf from "@/conf/conf";
import { useChatStore } from "@/store/chatStore";
import { Models } from "appwrite";
import React, { useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaLanguage } from "react-icons/fa";
import { MESSAGE_COST, useAuthStore } from "@/store/Auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ChatRoomProps {
  senderId: string;
  receiverId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ senderId, receiverId }) => {
  const {
    messages,
    loading,
    hasMore,
    addMessage,
    sendMessage,
    fetchMessages,
    resetMessages,
    setUpdatedMessage,
    question,
  } = useChatStore();
  const { user } = useAuthStore();
  const [inputMessage, setInputMessage] = useState("");
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [page, setPage] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFetched = useRef(false);
  const router = useRouter();

  const { trackQuestion, checkAndDeductBalance } = useAuthStore();

  // const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");

  console.log("senderId: ", senderId, "receiverId: ", receiverId);

  const fetchMoreMessages = async () => {
    if (!hasMore || loading) return;
    try {
      await fetchMessages(senderId, receiverId, page, 40);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.log("Error fetching more message: ", error);
    }
  };

  const languages = ["English", "Spanish", "French", "German", "Italian"];

  useEffect(() => {
    if (!user) return;

    // console.log("user from chat room: ", user);
    setSourceLanguage(user.prefs.preferredLanguage); // default target language is english
    setTargetLanguage("english");
    resetMessages();

    if (!isFetched.current) {
      fetchMoreMessages();

      const unsubscribe = client.subscribe(
        [
          `databases.${conf.appwriteHoroscopeDatabaseId}.collections.${conf.appwriteMessageCollectionId}.documents`,
        ],
        (response) => {
          // console.log("response from realtime: ", response);

          const payload = response.payload as Models.Document;
          // console.log("payload: ", payload);
          // console.log(
          //   "sender: ",
          //   payload.sender_id,
          //   "receiver: ",
          //   payload.receiver_id,
          // );

          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create",
            )
          ) {
            if (
              payload.is_temp === false &&
              senderId === payload.receiver_id &&
              receiverId === payload.sender_id
            ) {
              addMessage(payload);
              console.log("message added: ", payload);
            }
          }

          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update",
            )
          ) {
            if (
              payload.is_temp === false &&
              senderId === payload.receiver_id &&
              receiverId === payload.sender_id
            ) {
              addMessage(payload);
              setUpdatedMessage(payload);
              console.log("message updated: ", payload);
            }
          }
        },
      );

      // console.log("unsubscribe: ", unsubscribe);
      return () => {
        unsubscribe();
      };
    }

    isFetched.current = true;
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (question) {
      setInputMessage(question);
    }
  }, [question]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop } = chatContainerRef.current;
      if (scrollTop === 0 && hasMore && !loading) {
        fetchMoreMessages();
      }
    }
  };

  if (!user) {
    toast.error("login first");
    return null;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    try {
      // Check and deduct balance for message
      const balanceCheck = await checkAndDeductBalance(MESSAGE_COST, senderId);

      if (!balanceCheck.success) {
        if (balanceCheck.error) {
          toast.error(balanceCheck.error);
        }
        if (balanceCheck.error?.includes("Insufficient balance")) {
          router.push("/credit");
        }
        return;
      }

      // Track question count
      const trackResult = await trackQuestion();
      if (!trackResult.success) {
        toast.error("Failed to process message");
        return;
      }

      // Send message with translation if enabled
      if (sourceLanguage && targetLanguage) {
        await sendMessage(
          senderId,
          receiverId,
          inputMessage.trim(),
          user?.name,
          sourceLanguage,
          targetLanguage,
          true,
        );
      } else {
        await sendMessage(
          senderId,
          receiverId,
          inputMessage.trim(),
          user?.name,
          sourceLanguage,
          targetLanguage,
          false,
        );
      }

      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div
      className="flex flex-col h-screen bg-gray-100"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto px-4 py-4"
        onScroll={handleScroll}
      >
        {loading && <div className="text-center">Loading...</div>}
        {messages.map((message) => (
          <div
            key={message.$id}
            className={`mb-4 ${message.sender_id === senderId ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                message.sender_id === senderId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              {message.is_temp && message.receiver_id == user?.$id
                ? ""
                : message.body}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 px-4 py-3 sticky bottom-0 left-0 right-0">
        <div className="relative">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-grow bg-gray-100 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FaPaperPlane className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
