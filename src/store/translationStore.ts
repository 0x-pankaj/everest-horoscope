// src/store/translationStore.ts
import { create } from 'zustand';
import { database, client } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { ID, Query, Models } from 'appwrite';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface Translator {
  $id: string;
  name: string;
  languages: string[];
}

export interface Message {
  $id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  name: string;
  sourceLanguage: string;
  targetLanguage: string;
  is_temp: boolean;
  original_body?: string;
  $createdAt: string;
}

interface TranslationState {
  hydrated: boolean;
  sourceLanguage: string;
  targetLanguage: string;
  error: string | null;
  translator: Translator | null;
  messages: Message[];
  setHydrated: () => void;
  setSourceLanguage: (lang: string) => void;
  setTargetLanguage: (lang: string) => void;
  fetchTranslator: (id: string) => Promise<void>;
  fetchMessages: (translatorLanguages: string[]) => Promise<void>;
  updateTranslatedMessage: (messageId: string, translatedBody: string) => Promise<void>;
  addNewMessage: (message: Message) => void;
  removeMessage: (messageId: string) => void;
}

export const useTranslationStore = create<TranslationState>()(
  persist(
    immer((set, get) => ({
      hydrated: false,
      sourceLanguage: "",
      targetLanguage: "",
      error: null,
      translator: null,
      messages: [],
      setHydrated: () => set({ hydrated: true }),
      setSourceLanguage: (lang: string) => set({ sourceLanguage: lang }),
      setTargetLanguage: (lang: string) => set({ targetLanguage: lang }),

      fetchTranslator: async (id: string) => {
        try {
          const response = await database.getDocument(
            conf.appwriteHoroscopeDatabaseId, 
            conf.appwriteTranslatorCollectionId,
            id
          );
          set({ translator: response as unknown as Translator });
        } catch (error) {
          console.log("Error fetching translator: ", error);
          set({ error: "Failed to fetch translator details" });
        }
      },
      fetchMessages: async (translatorLanguages: string[]) => {
        try {
          const response = await database.listDocuments(
            conf.appwriteHoroscopeDatabaseId,
            conf.appwriteMessageCollectionId,
            [
              Query.equal('is_temp', true),
              Query.equal('sourceLanguage', translatorLanguages),
              Query.equal('targetLanguage', translatorLanguages),
              Query.orderDesc('$createdAt'),
            ]
          );
          console.log("messages: ", response);
          set({ messages: response.documents as unknown as Message[] });
        } catch (error) {
          console.log("Error fetching messages: ", error);
          set({ error: "Failed to fetch messages" });
        }
      },

      updateTranslatedMessage: async (messageId: string, translatedBody: string) => {
        try {
          const message = get().messages.find(m => m.$id === messageId);
          if (!message) throw new Error("Message not found");

          await database.updateDocument(
            conf.appwriteHoroscopeDatabaseId,
            conf.appwriteMessageCollectionId,
            messageId,
            {
              body: translatedBody,
              original_body: message.body,
              is_temp: false
            }
          );

          // Remove the translated message from the list
          set(state => ({
            messages: state.messages.filter(m => m.$id !== messageId)
          }));
        } catch (error) {
          console.log("Error updating translated message: ", error);
          set({ error: "Failed to update translated message" });
        }
      },


      addNewMessage: (message: Message) => {
        set(state => ({
          messages: [message, ...state.messages]
        }));
      },

      removeMessage: (messageId: string) => {
        set(state => ({
          messages: state.messages.filter(m => m.$id !== messageId)
        }));
      },



    })),
    {
      name: 'astro-translation',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);