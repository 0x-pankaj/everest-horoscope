// src/app/translator/[id]/page.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslationStore } from '@/store/translationStore';
import { client } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { Message } from '@/store/translationStore';
import Navbar from '@/components/Navbar';

const TranslatorPage = () => {
  const params = useParams();
  const { 
    fetchTranslator, 
    fetchMessages, 
    updateTranslatedMessage,
    addNewMessage,
    removeMessage,
    translator, 
    messages, 
    error 
  } = useTranslationStore();

  const [translatedMessages, setTranslatedMessages] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (params.id) {
      fetchTranslator(params.id as string);
    }
  }, [params.id, fetchTranslator]);

  useEffect(() => {
    if (translator) {
      fetchMessages(translator.languages);

      const unsubscribe = client.subscribe(`databases.${conf.appwriteHoroscopeDatabaseId}.collections.${conf.appwriteMessageCollectionId}.documents`, (response) => {
        const newMessage = response.payload as Message;

        console.log("newmessage: ", response);

        if (newMessage.is_temp && 
            translator.languages.includes(newMessage.sourceLanguage) && 
            translator.languages.includes(newMessage.targetLanguage)) {
              console.log("condition match");
          addNewMessage(newMessage);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [translator, fetchMessages, addNewMessage, removeMessage]);

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => 
      new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
    );
  }, [messages]);

  const handleTranslationChange = (messageId: string, translatedText: string) => {
    setTranslatedMessages(prev => ({ ...prev, [messageId]: translatedText }));
  };

  const handleSendTranslation = async (messageId: string) => {
    const translatedText = translatedMessages[messageId];
    if (translatedText) {
      await updateTranslatedMessage(messageId, translatedText);
      setTranslatedMessages(prev => {
        const { [messageId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  if (!translator) {
    return <div> Unauthorized!</div>;
  }
  if(error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Translator: {translator.name}</h1>
        <h2 className="text-xl mb-4">Languages: {translator.languages.join(', ')}</h2>
        <h3 className="text-lg mb-4">Messages to Translate:</h3>
        {sortedMessages.length === 0 ? (
          <p>No messages to translate.</p>
        ) : (
          <ul>
            {sortedMessages.map((message) => (
              <li key={message.$id} className="mb-6 border p-4 rounded">
                <div className="flex">
                  <div className="w-1/2 pr-4">
                    <p className="font-bold">From: {message.name}</p>
                    <p className="mb-2">Original Message: {message.body}</p>
                    <p>From: {message.sourceLanguage} To: {message.targetLanguage}</p>
                    <p>Created At: {new Date(message.$createdAt).toLocaleString()}</p>
                  </div>
                  <div className="w-1/2 pl-4">
                    <textarea
                      className="w-full p-2 border rounded"
                      value={translatedMessages[message.$id] || ''}
                      onChange={(e) => handleTranslationChange(message.$id, e.target.value)}
                      placeholder="Enter translated message here"
                    />
                    <button
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                      onClick={() => handleSendTranslation(message.$id)}
                    >
                      Send Translation
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TranslatorPage;