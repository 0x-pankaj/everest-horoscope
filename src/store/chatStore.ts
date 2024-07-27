

import {create} from 'zustand';
import { Query } from 'appwrite';
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
  sendMessage: (senderId: string, receiverId: string, body: string) => Promise<void>;
  fetchMessages: (senderId: string, receiverId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  loading: false,
  error: null,
  sendMessage: async (senderId: string, receiverId: string, body: string) => {
    try {
      set({ loading: true, error: null });
      const response = await database.createDocument(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteMessageCollectionId,
        ID.unique(),
        {
          sender_id: senderId,
          receiver_id: receiverId,
          body,
        //   created_at: new Date().toISOString(),
        }
      );
      console.log("Response from whiling sending message: ", response);
      set((state) => ({ messages: [...state.messages, response as Message] }));
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
        conf.appwriteMessageCollectionId,
        [
          Query.equal('sender_id', [senderId, receiverId]),
          Query.equal('receiver_id', [senderId, receiverId]),
        //   Query.orderAsc('created_at'),
        ]
      );
      console.log("Response while fetching: ", response);
      set({ messages: response.documents as Message[] });
    } catch (error) {
      set({ error: 'Failed to fetch messages' });
    } finally {
      set({ loading: false });
    }
  },
}));