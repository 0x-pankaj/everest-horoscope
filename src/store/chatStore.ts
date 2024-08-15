import { create } from 'zustand';
import { Models, Query } from 'appwrite';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { ID } from 'node-appwrite';

interface Message {
  $id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  name: string;
  $createdAt: string;
}

interface ChatUser {
  userId: string;
  name: string;
}

interface ChatState {
  messages: Message[];
  chattedUsers: ChatUser[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  addMessage: (message: Models.Document) => void;
  sendMessage: (senderId: string, receiverId: string, body: string, name: string) => Promise<void>;
  fetchMessages: (senderId: string, receiverId: string, page: number, limit: number) => Promise<void>;
  setMessages: (messages: Message[]) => void;
  resetMessages: () => void;
  setChattedUsers: (currentUserId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  chattedUsers: [],
  loading: false,
  error: null,
  hasMore: true,

  addMessage: (message: Models.Document) => {
    set((state) => ({
      messages: [message as unknown as Message, ...state.messages].sort(
        (a, b) => new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime()
      ),
    }));
  },

  setMessages: (messages: Message[]) => {
    set({ messages });
  },

  resetMessages: () => {
    set({ messages: [], hasMore: true });
  },

  sendMessage: async (senderId: string, receiverId: string, body: string, name: string) => {
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
          name
        }
      );
      console.log("Response from while sending message: ", response);
      set((state) => ({
        messages: [response as unknown as Message, ...state.messages].sort(
          (a, b) => new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime()
        ),
      }));
    } catch (error) {
      set({ error: 'Failed to send message' });
    } finally {
      set({ loading: false });
    }
  },

  fetchMessages: async (senderId: string, receiverId: string, page: number, limit: number) => {
    try {
      set({ loading: true, error: null });
      const response = await database.listDocuments(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteMessageCollectionId,
        [
          Query.equal('sender_id', [senderId, receiverId]),
          Query.equal('receiver_id', [senderId, receiverId]),
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
          Query.offset(page * limit),
        ]
      );
      console.log("Response while fetching: ", response);
      set((state) => ({
        messages: [...state.messages, ...response.documents as unknown as Message[]].sort(
          (a, b) => new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime()
        ),
        hasMore: response.documents.length === limit,
      }));
    } catch (error) {
      set({ error: 'Failed to fetch messages' });
    } finally {
      set({ loading: false });
    }
  },

  setChattedUsers: async (astroId: string) => {
    try {
      const response = await database.listDocuments(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteMessageCollectionId,
        [
          Query.search('sender_id', astroId),
          Query.search('receiver_id', astroId),
          Query.orderDesc('$createdAt'),
          Query.limit(100) // Adjust this limit as needed
        ]
      );
      console.log("response: ", response);
  
      const uniqueUsers = new Map<string, ChatUser>();
      response.documents.forEach((doc: Models.Document) => {
        if (doc.sender_id === astroId) {
          uniqueUsers.set(doc.receiver_id, { userId: doc.receiver_id, name: doc.receiver_name || 'Unknown User' });
        } else {
          uniqueUsers.set(doc.sender_id, { userId: doc.sender_id, name: doc.sender_name || 'Unknown User' });
        }
      });
  
      set({ chattedUsers: Array.from(uniqueUsers.values()) });
    } catch (error) {
      console.log('Failed to fetch chatted users:', error);
      set({ error: 'Failed to fetch chatted users' });
    }
  },
}));