
//imports
//interface definations
//zustand store
    //immer
    // persist

//store state and methods

//rehydration

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import {AppwriteException , ID, Models} from "appwrite";

import { account } from "@/appwrite/clientConfig";


interface IAuthStore {
    session: Models.Session | null;
    user: Models.User<Models.Preferences> | null;
    hydrated: boolean;

    setHydrated(): void;
    verifySession(): Promise<void>;
    login(
        email: string,
        password: string
    ): Promise<{success: boolean;
        error?:AppwriteException | null
        
    }>

    createAccount(
        // ID: string,
        email: string,
        password: string,
        name: string
    ):  Promise<{success: boolean, error?: AppwriteException | null}>

    logout() : Promise<void>
    updateBalance: (newBalance: number) => void;
    forgotPassword(email: string): Promise<{ success: boolean; error?: AppwriteException | null }>;
    verifyAccount(userId: string, secret: string): Promise<{ success: boolean; error?: AppwriteException | null }>;
}

export const useAuthStore = create<IAuthStore>()(
    persist(
        immer((set)=> ({
            session: null,
            user: null,
            hydrated: false,

            setHydrated() {
                set({hydrated: true})
            },

            async verifySession() {
                try {
                    const session = await account.getSession("current");
                    const user = await account.get();
                    set({session: session, user: user});
                } catch (error) {
                    console.log(error);
                    set({session: null})
                }
            },
            async login(email, password) {
                try {
                    const session = await account.createEmailPasswordSession(email, password);
                    const user = await account.get();
                    console.log("session, user ", session,user );
                    set({user: user, session: session})
                    return {success: true}
                } catch (error) {
                    console.log("error while login : ", error);
                    return {success: false, error: error instanceof AppwriteException? error : null}
                }

            },
            async createAccount(email, password , name) {
                try {
                    await account.create(ID.unique(), email, password, name);
                    return {success: true }
                } catch (error) {
                    console.log("error while creating account: ", error);
                    return {success: false, error: error instanceof AppwriteException? error : null}
                }
            },

            async logout() {
                try {
                    await account.deleteSession("current");
                    set({session: null, user: null});
                } catch (error) {
                    console.log("error while logout: ", error);

                }

            },
            async forgotPassword(email: string) {
                try {
                //   await account.createRecovery(email, 'http://localhost:3000/reset-password');
                await account.createRecovery(email, 'https://everest-horoscope.vercel.app/reset-password');
                  return { success: true };
                } catch (error) {
                  console.log("Error in forgot password: ", error);
                  return { success: false, error: error instanceof AppwriteException ? error : null };
                }
              },

              async verifyAccount(userId: string, secret: string) {
                try {
                  await account.updateVerification(userId, secret);
                  return { success: true };
                } catch (error) {
                  console.log("Error in account verification: ", error);
                  return { success: false, error: error instanceof AppwriteException ? error : null };
                }
              },
        
            updateBalance: (newBalance: number) => set((state) => ({
                user: state.user ? { ...state.user, balance: newBalance } : null
              })),
              
        })),

        {
            name: "auth",
            onRehydrateStorage() {
                return (state, error) => {
                    if(!error) state?.setHydrated()
                }
            },
        }
    )
)



