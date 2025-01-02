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

  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState<string[]>([]);
  const [targetLanguage, setTargetLanguage] = useState<string[]>([]);

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

  const handleTranslationClick = () => {
    setShowTranslationModal(true);
  };

  const handleTranslationSubmit = () => {
    console.log(`Translate from ${sourceLanguage} to ${targetLanguage}`);
    setShowTranslationModal(false);
  };

  const languages = ["English", "Spanish", "French", "German", "Italian"];

  useEffect(() => {
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
              type="button"
              onClick={handleTranslationClick}
              className="bg-gray-200 text-gray-600 px-4 py-2 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 "
            >
              <FaLanguage className="h-5 w-5" />
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FaPaperPlane className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {showTranslationModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowTranslationModal(false)}
            ></div>

            <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-md w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Translation Settings
                    </h3>
                    <div className="mb-4">
                      <label
                        htmlFor="sourceLanguage"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Translate from:
                      </label>
                      <select
                        id="sourceLanguage"
                        value={sourceLanguage}
                        onChange={(e) => setSourceLanguage(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="">Select source language</option>
                        {languages.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="targetLanguage"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Translate to:
                      </label>
                      <select
                        id="targetLanguage"
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="">Select target language</option>
                        {languages.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleTranslationSubmit}
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setShowTranslationModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
