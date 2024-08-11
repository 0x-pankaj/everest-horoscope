// store/astroStore.ts
import {create} from 'zustand';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { AppwriteException } from 'appwrite';

interface Astrologer {
  $id: string;
  user_id: string;
  name: string;
  photoUrl: string;
  bio: string;
  specialties: string[];
// specialties: string;
  rating: number;
  experience: number;
  hourlyRate: number;
  isOnline: boolean;
}
/*
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

*/

interface AstroState {
  hydrated: boolean;
  astrologers: Astrologer[];
  loading: boolean;
  error: AppwriteException | null;

  setHydrated(): void;
  fetchAstrologers(): Promise<void>;
}

export const useAstroStore = create<AstroState>()(
  persist(
    immer((set)=> ({
      hydrated: false,
      astrologers: [],
      loading: false,
      error: null,

      setHydrated() {
        set({hydrated: true})
      },

      async fetchAstrologers() {
        try {
            set({loading: true});
            const response = await database.listDocuments(
              conf.appwriteHoroscopeDatabaseId,
              conf.appwriteAstroCollectionId
                  );
                  console.log("astrologer: ", response)
                  set({ astrologers: response.documents as unknown as Astrologer[], loading: false });

        } catch (error ) {
            console.log("error while fetching astro in store: ", error);
            set({error: error instanceof AppwriteException? error : null, loading: false})
        }
      }
    })),
    {
      name: "astro",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated()
        }
      }
    } 

  )
)