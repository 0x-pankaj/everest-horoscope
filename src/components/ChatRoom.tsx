import { client } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { useChatStore } from '@/store/chatStore';
import { Models } from 'appwrite';
import React, { useEffect, useRef, useState } from 'react';
import { FaPaperPlane, FaChevronUp, FaChevronDown, FaLanguage } from 'react-icons/fa';
import {useAuthStore} from '@/store/Auth'
import toast from 'react-hot-toast';

interface ChatRoomProps {
  senderId: string;
  receiverId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ senderId, receiverId }) => {
  const { messages, loading, error, hasMore, addMessage, sendMessage, fetchMessages, resetMessages, setUpdatedMessage } = useChatStore();
  const { user} = useAuthStore();
  const [inputMessage, setInputMessage] = useState('');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [page, setPage] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFetched = useRef(false);

  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");

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
  }

  const handleTranslationSubmit = () => {
    console.log(`Translate from ${sourceLanguage} to ${targetLanguage}`);
    setShowTranslationModal(false)
  }

  const languages = [
    "English", "Spanish", "French", "German", "Italian"
  ];

  // useEffect(()=> {
  //   resetMessages();
  // },[])
 

  useEffect(() => {
    resetMessages();
    if (!isFetched.current) {
      fetchMoreMessages();

      const unsubscribe =  client.subscribe([`databases.${conf.appwriteHoroscopeDatabaseId}.collections.${conf.appwriteMessageCollectionId}.documents`], (response) => {
        console.log("response from realtime: ", response);
        
        const payload = response.payload as Models.Document;
        console.log("payload: ", payload);
        console.log("sender: ", payload.sender_id, "receiver: ", payload.receiver_id)

        if(response.events.includes("databases.*.collections.*.documents.*.create")){
          if ( payload.is_temp === false && senderId === payload.receiver_id && receiverId === payload.sender_id  ) {
            addMessage(payload);
            console.log("message added: ", payload);
          }
        }

        if(response.events.includes("databases.*.collections.*.documents.*.update")) {
          if ( payload.is_temp === false && senderId === payload.receiver_id && receiverId === payload.sender_id  ) {
            addMessage(payload)
            setUpdatedMessage(payload);
            console.log("message updated: ", payload);
          }
        }

      });

      console.log("unsubscribe: ", unsubscribe);
      return () => {
        unsubscribe();
      }

    }
  
    isFetched.current = true;
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop } = chatContainerRef.current;
      if (scrollTop === 0 && hasMore && !loading) {
        fetchMoreMessages();
      }
    }
  };

  if(!user) {
    toast.error("login first")
    return null;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
   
    if (inputMessage.trim()) {
      if(sourceLanguage && targetLanguage) {
        await sendMessage(senderId, receiverId, inputMessage.trim(), user?.name, sourceLanguage, targetLanguage, true)
        setInputMessage("")
      }else {
        await sendMessage(senderId, receiverId, inputMessage.trim(), user?.name,sourceLanguage, targetLanguage, false );
        setInputMessage('');

      }
      
    }
  };

  const handleQuestionClick = async (question: string) => {
    setInputMessage(question);
    await sendMessage(senderId, receiverId, question, user?.name, sourceLanguage, targetLanguage, false);
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
              {( message.is_temp && message.receiver_id == user?.$id  ) ? "" : message.body}
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
            type='button'
            onClick={handleTranslationClick}
            className='bg-gray-200 text-gray-600 px-4 py-2 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 '
            >
              <FaLanguage className='h-5 w-5' />
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

{showTranslationModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowTranslationModal(false)}></div>

            <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-md w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Translation Settings</h3>
                    <div className="mb-4">
                      <label htmlFor="sourceLanguage" className="block text-sm font-medium text-gray-700 mb-2">
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
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="targetLanguage" className="block text-sm font-medium text-gray-700 mb-2">
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
                          <option key={lang} value={lang}>{lang}</option>
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