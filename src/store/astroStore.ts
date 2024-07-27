// store/astroStore.ts
import create from 'zustand';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';

interface Astrologer {
  $id: string;
  user_id: string;
  name: string;
  photoUrl: string;
  bio: string;
//   specialties: string[];
specialties: string;
  rating: number;
  experience: number;
  hourlyRate: number;
  isOnline: boolean;
}

interface AstroState {
  astrologers: Astrologer[];
  loading: boolean;
  error: string | null;
  fetchAstrologers: () => Promise<void>;
}

export const useAstroStore = create<AstroState>((set) => ({
  astrologers: [],
  loading: false,
  error: null,
  fetchAstrologers: async () => {
    set({ loading: true });
    try {
      const response = await database.listDocuments(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteAstroCollectionId
      );
      console.log("astrologer: ", response)
      set({ astrologers: response.documents as Astrologer[], loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch astrologers', loading: false });
    }
  },
}));