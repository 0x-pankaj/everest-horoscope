import { database } from "@/appwrite/clientConfig";
import conf from "@/conf/conf";
import { AppwriteException } from "appwrite";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface Astrologer {
  $id: string;
  user_id: string;
  name: string;
  photoUrl: string;
  bio: string;
  specialties: string[];
  rating: number;
  experience: number;
  hourlyRate: number;
  isOnline: boolean;
  language: string[];
}

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
    immer((set) => ({
      hydrated: false,  
      astrologers: [],
      loading: false,
      error: null,

      setHydrated() {
        set({ hydrated: true });
      },

      async fetchAstrologers() {
        set({ loading: true });
        let retries = 3;
        while (retries > 0) {
          try {
            const response = await database.listDocuments(
              conf.appwriteHoroscopeDatabaseId,
              conf.appwriteAstroCollectionId
            );
            console.log("Fetched astrologers:", response);
            set({ astrologers: response.documents as unknown as Astrologer[], loading: false, error: null });
            return;
          } catch (error) {
            console.error("Error fetching astrologers (attempt " + (4 - retries) + "):", error);
            if (error instanceof AppwriteException) {
              console.error("Appwrite error details:", error.code, error.type, error.message);
            }
            retries--;
            if (retries === 0) {
              set({ error: error instanceof AppwriteException ? error : new AppwriteException("Unknown error occurred"), loading: false });
            } else {
              // Wait for a short time before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
      },
    })),
    {
      name: 'astro',
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);
