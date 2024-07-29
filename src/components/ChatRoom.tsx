import { client } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { useChatStore } from '@/store/chatStore';
import { Models } from 'appwrite';
import React, { useEffect, useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

interface ChatRoomProps {
  senderId: string;
  receiverId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ senderId, receiverId }) => {
  const { addMessage, messages, sendMessage, fetchMessages, loading, error } = useChatStore();
  const [inputMessage, setInputMessage] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isFetched = useRef(false);

  const predefinedQuestions = [
    "What does my birth chart say about my career?",
    "How will the upcoming planetary alignment affect my relationships?",
    "Can you explain the significance of my rising sign?",
    "What are my lucky days this month based on astrology?",
    "How can I balance my chakras according to my zodiac sign?",
    "Other (Type your own question)"
  ];

  useEffect(() => {
    if (!isFetched.current) {
      fetchMessages(senderId, receiverId);

      client.subscribe(`databases.${conf.appwriteHoroscopeDatabaseId}.collections.${conf.appwriteMessageCollectionId}.documents`, (response) => {
        console.log("response from realtime: ", response);
        
        const payload = response.payload as Models.Document

        if (senderId !== payload["sender_id"]) {
          addMessage(payload); 
          console.log(payload);
        }
      });
    }
    isFetched.current = true;
  }, [fetchMessages, senderId, receiverId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      await sendMessage(senderId, receiverId, inputMessage.trim());
      setInputMessage('');
      setShowCustomInput(false);
    }
  };

  const handleQuestionClick = async (question: string) => {
    if (question === "Other (Type your own question)") {
      setShowCustomInput(true);
    } else {
      await sendMessage(senderId, receiverId, question);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100" style={{ height: 'calc(100vh - 4rem)' }}>
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <div
            key={message.$id}
            className={`mb-4 ${message.sender_id === senderId ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                message.sender_id === senderId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-800'
              }`}
            >
              {message.body}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 0 && (
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <h3 className="text-lg font-semibold mb-2">Choose a question or ask your own:</h3>
          <div className="space-y-2">
            {predefinedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question)}
                className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {(showCustomInput || messages.length > 0) && (
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FaPaperPlane className="h-7 w-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;