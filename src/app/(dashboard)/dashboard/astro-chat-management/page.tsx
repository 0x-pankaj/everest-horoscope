"use client";
import React, { useState, useEffect } from "react";
import { FaUser, FaLanguage, FaChevronLeft, FaClock } from "react-icons/fa";
import axios from "axios";

interface Translator {
  $id: string;
  name: string;
  user_id: string;
  languages: string[];
}

interface Message {
  $id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  original_body: string;
  name: string;
  sourceLanguage: string;
  targetLanguage: string;
  translated_by: string;
  $createdAt: string;
}

export default function TranslatorChatManagement() {
  const [translators, setTranslators] = useState<Translator[]>([]);
  const [selectedTranslator, setSelectedTranslator] =
    useState<Translator | null>(null);
  const [translatedChats, setTranslatedChats] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTranslators();
  }, []);

  const fetchTranslators = async () => {
    try {
      const response = await axios.get("/api/translators");
      setTranslators(response.data);
    } catch (error) {
      console.error("Error fetching translators:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTranslatorChats = async (translatorId: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/translator-chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          translated_by: translatorId,
        }),
      });

      const data = await response.json();
      if (data.documents) {
        setTranslatedChats(data.documents);
      }
    } catch (error) {
      console.error("Error fetching translator chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslatorSelect = async (translator: Translator) => {
    setSelectedTranslator(translator);
    await fetchTranslatorChats(translator.$id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        {selectedTranslator ? (
          <button
            onClick={() => {
              setSelectedTranslator(null);
              setTranslatedChats([]);
            }}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaChevronLeft className="mr-2" />
            Back to Translators
          </button>
        ) : (
          <h1 className="text-3xl font-bold">Translator Management</h1>
        )}
      </div>

      {!selectedTranslator ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {translators.map((translator) => (
            <div
              key={translator.$id}
              className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleTranslatorSelect(translator)}
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaUser className="text-blue-500 text-xl" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold">{translator.name}</h2>
                  <p className="text-gray-600">ID: {translator.user_id}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Languages:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {translator.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                    >
                      <FaLanguage className="mr-1" />
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              {selectedTranslator.name}
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTranslator.languages.map((lang, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                >
                  <FaLanguage className="mr-1" />
                  {lang}
                </span>
              ))}
            </div>
            <p className="text-gray-600">
              Total Translations: {translatedChats.length}
            </p>
          </div>

          {translatedChats.map((chat) => (
            <div key={chat.$id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <FaLanguage className="text-blue-500 mr-2" />
                  <span className="font-medium">
                    {chat.sourceLanguage} → {chat.targetLanguage}
                  </span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <FaClock className="mr-1" />
                  {formatDate(chat.$createdAt)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <div className="text-sm font-medium text-gray-500 mb-2">
                    Original ({chat.sourceLanguage})
                  </div>
                  <div className="text-gray-800">{chat.original_body}</div>
                  <div className="mt-2 text-sm text-gray-500">
                    Sender: {chat.sender_id}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded">
                  <div className="text-sm font-medium text-gray-500 mb-2">
                    Translated ({chat.targetLanguage})
                  </div>
                  <div className="text-gray-800">{chat.body}</div>
                  <div className="mt-2 text-sm text-gray-500">
                    Receiver: {chat.receiver_id}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {translatedChats.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
              No translated chats found for this translator
            </div>
          )}
        </div>
      )}
    </div>
  );
}
