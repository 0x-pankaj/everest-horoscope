// src/store/translationStore.ts
import { create } from 'zustand';
import { database} from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import {  Models, Query  } from 'appwrite';
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
  laoding: boolean;
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
      laoding: false,
      translator: null,
      messages: [],
      setHydrated: () => set({ hydrated: true }),
      setSourceLanguage: (lang: string) => set({ sourceLanguage: lang }),
      setTargetLanguage: (lang: string) => set({ targetLanguage: lang }),

      fetchTranslator: async (id: string) => {
        try {
          set({laoding: true})
          console.log("database: ", conf.appwriteHoroscopeDatabaseId)
          console.log("collectionId: ", conf.appwriteTranslatorCollectionId)
          const response = await database.listDocuments(
            conf.appwriteHoroscopeDatabaseId,
            conf.appwriteTranslatorCollectionId,
            [
              Query.equal("user_id", id)
            ]
          );
          console.log("Translator: ", response.documents[0]);
          if (response.documents.length === 0) {
            throw new Error("Translator not found");
          }
          set({laoding: false, translator: response.documents[0] as unknown as Translator });
        } catch (error) {
          console.error("Error fetching translator: ", error);
          set({ laoding: false, error: error instanceof Error ? error.message : "Failed to fetch translator details" });
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
          
          set((state) => {
            const newMessages = response.documents
              .filter((doc: Models.Document) => !state.messages.some(m => m.$id === doc.$id))
              .map((doc: Models.Document) => doc as unknown as Message);
      
            return {
              messages: [...newMessages, ...state.messages].sort(
                (a, b) => new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime()
              )
            };
          });

          // set({ messages: response.documents as unknown as Message[] });
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