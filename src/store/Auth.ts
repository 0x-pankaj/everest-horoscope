import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models } from "appwrite";

import { account } from "@/appwrite/clientConfig";

interface IAuthStore {
    session: Models.Session | null;
    user: Models.User<Models.Preferences> | null;
    roles: string[];
    hydrated: boolean;

    setHydrated(): void;
    updateUser: (updatedUser: Models.User<Models.Preferences>) => void;
    verifySession(): Promise<void>;
    login(
        email: string,
        password: string
    ): Promise<{
        success: boolean;
        error?: AppwriteException | null
    }>;

    createAccount(
        email: string,
        password: string,
        name: string
    ): Promise<{ success: boolean; error?: AppwriteException | null }>;

    logout(): Promise<void>;
    updateBalance: (newBalance: number) => void;
}

export const useAuthStore = create<IAuthStore>()(
    persist(
        immer((set) => ({
            session: null,
            user: null,
            hydrated: false,
            roles: [],

            setHydrated() {
                set({ hydrated: true })
            },
            updateUser: (updatedUser) => set({ user: updatedUser }),

            async verifySession() {
                try {
                    const session = await account.getSession("current");
                    const user = await account.get();
                    const roles = user.labels || [];
                    set({ session: session, user: user, roles: roles });
                } catch (error) {
                    console.log(error);
                    set({ session: null, user: null, roles: [] })
                }
            },

            async login(email, password) {
                try {

                    const session = await account.createEmailPasswordSession(email, password);
                    const user = await account.get();
                    // if (!user.emailVerification){
                    //      const checkVerification = await account.createVerification("http://localhost:3000/verify-account");
                    //      return {success: true}
                    // }
                    const roles = user.labels || [];
                    console.log("session, user ", session, user);
                    set({ user: user, session: session, roles: roles })
                    return { success: true }
                } catch (error) {
                    console.log("error while login : ", error);
                    return { success: false, error: error instanceof AppwriteException ? error : null }
                }
            },

            async createAccount(email, password, name) {
                try {
                    console.log("create account hitted")
                    const x = await account.create(ID.unique(), email, password, name);
                    // const session = await account.createEmailPasswordSession(email, password);

                    // const link = await account.createVerification("http://localhost:3000/verify-account");

                    return { success: true }
                } catch (error) {
                    console.log("error while creating account: ", error);
                    return { success: false, error: error instanceof AppwriteException ? error : null }
                }
            },

            async logout() {
                try {
                    console.log("logoutcalled")
                    localStorage.clear();
                    await account.deleteSession("current");
                    set({ session: null, user: null, roles: [] });
                    // localStorage.removeItem('auth'); // Clear the persisted state

                } catch (error) {
                    console.log("error while logout: ", error);
                }
            },

            async forgotPassword(email: string) {
                try {
                    await account.createRecovery(email, 'http://localhost:3000/reset-password');
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
                    if (!error) state?.setHydrated()
                }
            },
        }
    )
)