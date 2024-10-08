

import {create} from 'zustand';
import { Models, Query } from 'appwrite';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { ID } from 'node-appwrite';

interface Message {
  $id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  addMessage:(message: Models.Document) => void;
  sendMessage: (senderId: string, receiverId: string, body: string) => Promise<void>;
  fetchMessages: (senderId: string, receiverId: string) => Promise<void>;
}

export const useTeamChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  error: null,

  addMessage: (message: Models.Document) => {
      set((state) => ({messages: [...state.messages, message as unknown as  Message]}))
  },

  sendMessage: async (senderId: string, receiverId: string, body: string) => {
    try {
      set({ loading: true, error: null });
      const response = await database.createDocument(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteMessageWithTeamCollectionId,
        ID.unique(),
        {
            
          sender_id: senderId,
          receiver_id: receiverId,
          body,
        }
      );
      console.log("Response from whiling sending message: ", response);
      set((state) => ({ messages: [...state.messages, response as unknown as Message] }));
    } catch (error) {
      set({ error: 'Failed to send message' });
    } finally {
      set({ loading: false });
    }
  },
  fetchMessages: async (senderId: string, receiverId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await database.listDocuments(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteMessageWithTeamCollectionId,
        [
          Query.equal('sender_id', [senderId, receiverId]),
          Query.equal('receiver_id', [senderId, receiverId]),
        //   Query.orderAsc('created_at'),
        ]
      );
      console.log("Response while fetching: ", response);
      set({ messages: response.documents as unknown as Message[]});
    } catch (error) {
      set({ error: 'Failed to fetch messages' });
    } finally {
      set({ loading: false });
    }
  },
}));