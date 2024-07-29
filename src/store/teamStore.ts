import { database } from "@/appwrite/clientConfig";
import Admin from "@/components/Admin";
import conf from "@/conf/conf";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface Admin {
    $id: string;
    user_id: string;
    name: string;
    photoUrl: string | null;
}

interface AdminState {
    hydrated: boolean;
    admin: Admin[];
    error: string | null;
    loading: boolean;
    setHydrated(): void;
    fetchAdmin(): Promise<void>;
}

export const useAdminStore = create<AdminState>()(
    persist(
        immer((set)=> ({
            hydrated: false,
            Admin: [],
            error: null,
            loading: true,

            setHydrated() {
                set({hydrated: true})
            },

            async fetchAdmin() {
                    try {
                        const admin = await database.listDocuments(conf.appwriteHoroscopeDatabaseId, conf.appwroteAdminCollectionId);
                        console.log("admin: ", admin);
                        set({admin: admin.documents as Admin[] , loading: false})
                    } catch (error) {
                        console.log("errro from fetch admin: ", error);
                        set({loading: false, error: error})
                    }
            }
        })),{
            name: "adminStore",
            onRehydrateStorage() {
                return (state, error) => {
                  if (!error) state?.setHydrated()
                }
              }
        }
    )
)