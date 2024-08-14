import { client } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { useChatStore } from '@/store/chatStore';
import { Models } from 'appwrite';
import React, { useEffect, useRef, useState } from 'react';
import { FaPaperPlane, FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface ChatRoomProps {
  senderId: string;
  receiverId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ senderId, receiverId }) => {
  const { messages, loading, error, hasMore, addMessage, sendMessage, fetchMessages } = useChatStore();
  const [inputMessage, setInputMessage] = useState('');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [page, setPage] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFetched = useRef(false);

  const predefinedQuestions: Record<string, Array<string>> = {
    'Personality & Life': [
      "How would you describe my personality traits?",
      "Can I realistically achieve my life goals?",
      "Will I maintain stability in my daily life?",
      "How satisfied can I expect to be with my life?",
      "Is there potential for unexpected recognition or honor?",
      "Are there any major changes on the horizon in my life?"
    ],
    'Luck & Fortune': [
      "Does luck seem to be on my side?",
      "When might I encounter the best opportunities for financial success?",
      "What actions can I take to improve my destiny?",
      "When is it likely I'll fulfill my ultimate destiny?",
      "Which numbers and colors are considered lucky for me?"
    ],
    'Money & Income': [
      "What income level can I expect?",
      "What are the most profitable options for earning money?",
      "Is it wise to invest my savings?",
      "Why do I struggle to save money?",
      "Can I recover lost funds?"
    ],
    'Love & Marriage': [
      "When might I find my ideal life partner?",
      "Can you describe the characteristics of my future partner?",
      "What path is best for marriage?",
      "Is there potential for a new relationship this year?",
      "Can I expect satisfaction in my marriage?"
    ],
    'Other': [
      "Other (Type your own question)"
    ]
  };

  const fetchMoreMessages = async () => {
    if (!hasMore || loading) return;
    await fetchMessages(senderId, receiverId, page, 40);
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (!isFetched.current) {
      fetchMoreMessages();

      const unsubscribe =  client.subscribe(`databases.${conf.appwriteHoroscopeDatabaseId}.collections.${conf.appwriteMessageCollectionId}.documents`, (response) => {
        console.log("response from realtime: ", response);
        
        const payload = response.payload as Models.Document;

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

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop } = chatContainerRef.current;
      if (scrollTop === 0 && hasMore) {
        fetchMoreMessages();
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      await sendMessage(senderId, receiverId, inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleQuestionClick = async (question: string) => {
    setInputMessage(question);
    await sendMessage(senderId, receiverId, question);
    setInputMessage("");
    setShowQuestionModal(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100" style={{ height: 'calc(100vh - 4rem)' }}>
      <div 
        ref={chatContainerRef} 
        className="flex-grow overflow-y-auto px-4 py-4"
        onScroll={handleScroll}
      >
        {loading && <div className="text-center">Loading...</div>}
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

      <div className="bg-white border-t border-gray-200 px-4 py-3 sticky bottom-0 left-0 right-0">
        <div className="relative">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <button
              type="button"
              onClick={() => setShowQuestionModal(true)}
              className="bg-gray-200 text-gray-600 px-4 py-2 rounded-r-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FaChevronUp className="h-5 w-5" />
            </button>
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

      {showQuestionModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowQuestionModal(false)}></div>

            <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-md w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Choose a question</h3>
                    <div className="mt-2 max-h-[400px] overflow-y-auto">
                      {Object.keys(predefinedQuestions).map((category) => (
                        <div key={category} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{category}</span>
                            <FaChevronDown className="h-5 w-5" />
                          </div>
                          <div className="mt-2 space-y-2">
                            {predefinedQuestions[category].map((question) => (
                              <button
                                key={question}
                                onClick={() => handleQuestionClick(question)}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded-lg transition duration-200"
                              >
                                {question}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
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


/*
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
*/