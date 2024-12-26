// import { create } from "zustand";
// import { Models, Query, ID } from "appwrite";
// import { database } from "@/appwrite/clientConfig";
// import conf from "@/conf/conf";

// interface Message {
//   $id: string;
//   sender_id: string;
//   receiver_id: string;
//   body: string;
//   name: string;
//   is_temp: boolean;
//   original_body: string;
//   $createdAt: string;
// }

// interface ChatUser {
//   userId: string;
//   name: string;
//   lastMessage: string;
//   lastMessageTime: string;
// }
// interface Question {
//   question: null;
// }

// interface ChatState {
//   messages: Message[];
//   chattedUsers: ChatUser[];
//   loading: boolean;
//   error: string | null;
//   currentPage: number;
//   question: string | null;
//   hasMore: boolean;

//   // fetchLatestChats: (astroId: string) => Promise<void>;
//   addQuestion: (question: string) => void;
//   addMessage: (message: Models.Document) => void;
//   sendMessage: (
//     senderId: string,
//     receiverId: string,
//     body: string,
//     name: string,
//     sourceLanguage?: string,
//     targetLanguage?: string,
//     is_temp?: boolean,
//     original_body?: string,
//   ) => Promise<void>;
//   fetchMessages: (
//     senderId: string,
//     receiverId: string,
//     page: number,
//     limit: number,
//   ) => Promise<void>;
//   setMessages: (messages: Message[]) => void;
//   setUpdatedMessage: (message: Models.Document) => void;
//   resetMessages: () => void;
//   setChattedUsers: (currentUserId: string) => Promise<void>;
// }

// export const useChatStore = create<ChatState>((set, get) => ({
//   messages: [],
//   chattedUsers: [],
//   loading: false,
//   error: null,
//   hasMore: true,
//   currentPage: 0,
//   question: null,

//   addQuestion: (question: string) => {
//     set({ question: question });
//   },
//   addMessage: (message: Models.Document) => {
//     set((state) => {
//       const messageExists = state.messages.some((m) => m.$id === message.$id);
//       if (!messageExists) {
//         return {
//           messages: [message as unknown as Message, ...state.messages].sort(
//             (a, b) =>
//               new Date(a.$createdAt).getTime() -
//               new Date(b.$createdAt).getTime(),
//           ),
//         };
//       }
//       return state; // Return the current state if the message already exists
//     });
//   },

//   setUpdatedMessage: (message: Models.Document) => {
//     set((state) => {
//       console.log("update message triggered: ", message);
//       const updatedMessage = state.messages.map((m) => {
//         if (m.$id === message.$id) {
//           return {
//             ...m,
//             ...message,
//           } as Message;
//         }
//         return m;
//       });
//       return {
//         messages: updatedMessage.sort(
//           (a, b) =>
//             new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime(),
//         ),
//       };
//     });
//   },

//   setMessages: (messages: Message[]) => {
//     set({ messages });
//   },

//   resetMessages: () => {
//     set({ messages: [], hasMore: true });
//   },

//   sendMessage: async (
//     senderId: string,
//     receiverId: string,
//     body: string,
//     name: string,
//     sourceLanguage?: string,
//     targetLanguage?: string,
//     is_temp?: boolean,
//     translated_body?: string,
//   ) => {
//     try {
//       set({ loading: true, error: null });
//       const response = await database.createDocument(
//         conf.appwriteHoroscopeDatabaseId,
//         conf.appwriteMessageCollectionId,
//         ID.unique(),
//         {
//           sender_id: senderId,
//           receiver_id: receiverId,
//           body,
//           name,
//           sourceLanguage: sourceLanguage,
//           targetLanguage: targetLanguage,
//           is_temp: is_temp,
//           translated_body: translated_body,
//         },
//       );
//       console.log("Response from while sending message: ", response);
//       get().addMessage(response);
//     } catch (error) {
//       set({ error: "Failed to send message" });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   fetchMessages: async (
//     senderId: string,
//     receiverId: string,
//     page: number,
//     limit: number,
//   ) => {
//     try {
//       set({ loading: true, error: null });
//       const response = await database.listDocuments(
//         conf.appwriteHoroscopeDatabaseId,
//         conf.appwriteMessageCollectionId,
//         [
//           Query.equal("sender_id", [senderId, receiverId]),
//           Query.equal("receiver_id", [senderId, receiverId]),
//           // Query.equal('is_temp', false),
//           Query.orderDesc("$createdAt"),
//           Query.limit(limit),
//           Query.offset(page * limit),
//         ],
//       );

//       set((state) => {
//         const newMessages = response.documents
//           .filter(
//             (doc: Models.Document) =>
//               !state.messages.some((m) => m.$id === doc.$id),
//           )
//           .map((doc: Models.Document) => doc as unknown as Message);

//         return {
//           messages: [...newMessages, ...state.messages].sort(
//             (a, b) =>
//               new Date(a.$createdAt).getTime() -
//               new Date(b.$createdAt).getTime(),
//           ),
//           hasMore: response.documents.length === limit,
//         };
//       });
//     } catch (error) {
//       set({ error: "Failed to fetch messages" });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   setChattedUsers: async (astroId: string) => {
//     try {
//       const response = await database.listDocuments(
//         conf.appwriteHoroscopeDatabaseId,
//         conf.appwriteMessageCollectionId,
//         [
//           Query.equal("receiver_id", [astroId]),
//           Query.equal("sender_id", [astroId]),
//           Query.orderDesc("$createdAt"),
//           // Query.limit(200)
//         ],
//       );
//       console.log("response: ", response);

//       const uniqueUsers = new Map<string, ChatUser>();
//       response.documents.forEach((doc: Models.Document) => {
//         if (doc.receiver_id === astroId && !uniqueUsers.has(doc.sender_id)) {
//           uniqueUsers.set(doc.sender_id, {
//             userId: doc.sender_id,
//             name: doc.name || "Unknown User",
//           });
//         }
//       });

//       console.log("unique user: ", uniqueUsers);

//       set({ chattedUsers: Array.from(uniqueUsers.values()) });
//     } catch (error) {
//       console.log("Failed to fetch chatted users:", error);
//       set({ error: "Failed to fetch chatted users" });
//     }
//   },
// }));
