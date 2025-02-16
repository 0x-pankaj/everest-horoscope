//src/store/Auth.ts

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models, OAuthProvider } from "appwrite";

import { account } from "@/appwrite/clientConfig";
import axios from "axios";
import { users } from "@/appwrite/serverConfig";

type BalanceOperation = "ADD" | "SUBTRACT";
export type UserRole = "admin" | "astrologer" | "translator" | "simpleuser";

// Constants for costs
export const MESSAGE_COST = 1; // Cost per message
export const INITIAL_QUESTION_COST = 2; // Cost for starting a new chat
export const FREE_QUESTIONS_LIMIT = 3; // Number of free questions allowed

interface IAuthStore {
  session: Models.Session | null;
  user: Models.User<Models.Preferences> | null;
  roles: string[];
  hydrated: boolean;

  checkAndDeductBalance: (
    amount: number,
    astrologerastrologerId?: string,
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
  trackQuestion: () => Promise<{
    success: boolean;
    error?: string;
  }>;

  setHydrated(): void;
  updateUser: (updatedUser: Models.User<Models.Preferences>) => void;
  verifySession(): Promise<void>;
  login(
    email: string,
    password: string,
  ): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;

  createAccount(
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;

  logout(): Promise<void>;

  updateBalance: (
    amount: number,
    operation: BalanceOperation,
  ) => Promise<{
    success: boolean;
    newBalance: number | null;
    error?: string;
  }>;

  updateFreeMessageCredits: (
    userId: string,
    credits: number,
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;

  forgotPassword(
    email: string,
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  verifyAccount(
    userId: string,
    secret: string,
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;

  loginWithGoogle(): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;

  handleOAuthCallback(): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      user: null,
      hydrated: false,
      roles: [],

      setHydrated() {
        set({ hydrated: true });
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
          set({ session: null, user: null, roles: [] });
        }
      },

      async login(email, password) {
        try {
          // First, try to get the current session
          try {
            await account.getSession("current");
            // If this succeeds, we have an active session
            console.log("Active session found, logging out first");
            await account.deleteSession("current");
          } catch (sessionError) {
            // No active session, proceed with login
            console.log("No active session found, proceeding with login");
          }

          // Now attempt to create a new session
          const session = await account.createEmailPasswordSession(
            email,
            password,
          );

          const usercreate = await account.get();
          if (!usercreate.emailVerification) {
            // await account.deleteSession();
            // await account.createVerification("http://localhost:3000/verify-account")
            await account.createVerification(
              "https://www.everestastro.com//verify-account",
            );
            alert("Please verify email check your email");
            return { success: false };
          }
          const roles = usercreate.labels || [];
          console.log("New session created, user logged in");
          set({ user: usercreate, session: session, roles: roles });
          return { success: true };
        } catch (error) {
          console.log("Error while login: ", error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async createAccount(email, password, name) {
        try {
          try {
            await account.getSession("current");
            // If this succeeds, we have an active session
            console.log("Active session found, logging out first");
            await account.deleteSession("current");
          } catch (sessionError) {
            // No active session, proceed with login
            console.log("No active session found, proceeding with login");
          }
          console.log("create account hitted");
          console.log(email, password, name);
          const x = await account.create(ID.unique(), email, password, name);
          const session = await account.createEmailPasswordSession(
            email,
            password,
          );

          // const link = await account.createVerification(`http://localhost:3000/verify-account`)
          const link = await account.createVerification(
            `https://everestastro.com//verify-account`,
          );
          await account.updatePrefs({
            balance: 0, // This will be stored as a number
          });

          return { success: true };
        } catch (error) {
          console.log("error while creating account: ", error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async logout() {
        try {
          console.log("logoutcalled");
          localStorage.clear();
          await account.deleteSession("current");
          set({ session: null, user: null, roles: [] });
          console.log("logout done!");
          // localStorage.removeItem('auth'); // Clear the persisted state
        } catch (error) {
          console.log("error while logout: ", error);
        }
      },

      async forgotPassword(email: string) {
        try {
          await account.createRecovery(
            email,
            `https://everestastro.com/reset-password`,
          );
          return { success: true };
        } catch (error) {
          console.log("Error in forgot password: ", error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async verifyAccount(userId: string, secret: string) {
        try {
          await account.updateVerification(userId, secret);
          return { success: true };
        } catch (error) {
          console.log("Error in account verification: ", error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async loginWithGoogle() {
        try {
          account.createOAuth2Session(
            OAuthProvider.Google,
            `https://everestastro.com/auth-callback`,
            `https://everestastro.com/login`,
            ["profile", "email"],
            // `${process.env.NEXT_PUBLIC_BASE_URL}/auth-callback`, // Success URL
            // `${process.env.NEXT_PUBLIC_BASE_URL}/login`, // Failure URL
            // ["profile", "email"], // Requested scopes
          );
          return { success: true };
        } catch (error) {
          console.error("Error in Google login:", error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async handleOAuthCallback() {
        try {
          const session = await account.getSession("current");
          const user = await account.get();
          const roles = user.labels || [];

          // Initialize user preferences if they don't exist
          if (!user.prefs || !user.prefs.balance) {
            await account.updatePrefs({
              balance: 0,
              questionsAsked: 0,
              freeMessageCredits: 0,
            });
          }

          set({ session, user, roles });
          return { success: true };
        } catch (error) {
          console.error("Error handling OAuth callback:", error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      updateBalance: async (amount: number, operation: BalanceOperation) => {
        try {
          const currentUser = await account.get();
          if (!currentUser?.prefs) {
            return {
              success: false,
              newBalance: null,
              error: "User preferences not found",
            };
          }

          // Get current balance, converting from string to number if needed
          const currentBalance = Number(currentUser.prefs.balance || 0);

          if (isNaN(currentBalance)) {
            return {
              success: false,
              newBalance: null,
              error: "Invalid current balance",
            };
          }

          // Calculate new balance based on operation
          let newBalance: number;
          if (operation === "ADD") {
            console.log(
              "current balance before adding balance : ",
              currentBalance,
            );
            newBalance = currentBalance + amount;
            console.log("after adding balace newBalance : ", newBalance);
          } else {
            if (currentBalance < amount) {
              return {
                success: false,
                newBalance: currentBalance,
                error: "Insufficient balance",
              };
            }
            newBalance = currentBalance - amount;
          }

          // Preserve existing preferences and update balance
          const updatedPrefs = {
            ...currentUser.prefs, // Keep all existing preferences
            balance: newBalance, // Update only the balance
          };

          // Update preferences in Appwrite
          await account.updatePrefs(updatedPrefs);

          // Update local state while preserving other preferences
          set((state) => ({
            user: state.user
              ? {
                  ...state.user,
                  prefs: updatedPrefs,
                }
              : null,
          }));

          return {
            success: true,
            newBalance: newBalance,
            error: undefined,
          };
        } catch (error) {
          console.error("Error updating balance:", error);
          return {
            success: false,
            newBalance: null,
            error:
              error instanceof Error ? error.message : "Unknown error occurred",
          };
        }
      },

      updateFreeMessageCredits: async (userId: string, credits: number) => {
        try {
          // const targetUser = await account.get();
          const targetUser = await axios.get(`/api/getUser/${userId}`);
          // console.log("targetUser: ", targetUser.data);
          if (!targetUser?.data?.prefs) {
            return {
              success: false,
              error: "User not found",
            };
          }
          // console.log("targetUser.data.prefs: ", targetUser.data.prefs);
          const currentCredits = targetUser.data.prefs.freeMessageCredits;
          const updatedPrefs = {
            ...targetUser.data.prefs,
            freeMessageCredits: currentCredits + credits,
          };

          // console.log("updatedPrefs: ", updatedPrefs);

          // await account.updatePrefs(updatedPrefs);
          // src/app/api/users/[userId]/prefs/route.ts
          // await axios.patch(`/api/users/${userId}/prefs`, updatedPrefs);
          // await axios.patch(`/api/updateUser/${userId}`, updatedPrefs);
          const result = await users.updatePrefs(
            userId, // userId
            updatedPrefs, // prefs
          );
          return { success: true };
        } catch (error) {
          console.error("Error updating free message credits:", error);
          return {
            success: false,
            error: "Failed to update free message credits",
          };
        }
      },

      checkAndDeductBalance: async (amount: number, astrologerId?: string) => {
        try {
          console.log("hitted 1");
          const user = await account.get();
          if (!user?.prefs) {
            return {
              success: false,
              error: "User not logged in",
            };
          }

          console.log("hitted 2");
          // Skip balance check if user is the astrologer
          // if (astrologerId && user.$id === astrologerId) {
          //   console.log("astrologerId: ", astrologerId, "userId: ", user.$id);
          //   return { success: true }; // Astrologers don't need to pay
          // }
          console.log("hitted 3");
          // Skip balance check if user has astrologer or admin role
          if (
            user.labels &&
            (user.labels.includes("astrologer") ||
              user.labels.includes("admin"))
          ) {
            return { success: true }; // Astrologers and admins don't need to pay
          }

          console.log("hitted 4");
          //checking for free credit
          const freeCredits = Number(user.prefs.freeMessageCredits || 0);
          if (freeCredits > 0) {
            // Use a free message credit instead of deducting balance
            const updatedPrefs2 = {
              ...user.prefs,
              freeMessageCredits: freeCredits - 1,
            };

            await account.updatePrefs(updatedPrefs2);

            set((state) => ({
              user: state.user
                ? {
                    ...state.user,
                    prefs: updatedPrefs2,
                  }
                : null,
            }));

            return { success: true };
          }

          console.log("hitted 5");
          //checking regular free credit limit
          const questionsAsked = Number(user.prefs.questionsAsked || 0);
          console.log("questionAsked: ", questionsAsked);
          if (questionsAsked <= FREE_QUESTIONS_LIMIT) {
            return {
              success: true,
            };
          }

          console.log("hitted 6");
          // If no free credits and beyond free questions limit, check and deduct balance
          const currentBalance = Number(user.prefs.balance || 0);

          if (currentBalance < amount) {
            return {
              success: false,
              error: `Insufficient balance. Required: $${amount}, Available: $${currentBalance}`,
            };
          }

          // Update balance only if it's greater than or equal to the free questions limit
          const newBalance = currentBalance - amount;
          const updatedPrefs = {
            ...user.prefs,
            balance: newBalance,
          };

          await account.updatePrefs(updatedPrefs);
          console.log("hitted 7");
          set((state) => ({
            user: state.user
              ? {
                  ...state.user,
                  prefs: updatedPrefs,
                }
              : null,
          }));

          return { success: true };
        } catch (error) {
          console.error("Error in checkAndDeductBalance:", error);
          return {
            success: false,
            error: "Failed to process payment",
          };
        }
      },

      trackQuestion: async () => {
        try {
          const user = await account.get();
          if (!user?.prefs) {
            return {
              success: false,
              error: "User not logged in",
            };
          }

          const currentQuestions = Number(user.prefs.questionsAsked || 0);
          const updatedPrefs = {
            ...user.prefs,
            questionsAsked: currentQuestions + 1,
          };

          await account.updatePrefs(updatedPrefs);

          set((state) => ({
            user: state.user
              ? {
                  ...state.user,
                  prefs: updatedPrefs,
                }
              : null,
          }));

          return { success: true };
        } catch (error) {
          console.error("Error in trackQuestion:", error);
          return {
            success: false,
            error: "Failed to track question",
          };
        }
      },
    })),

    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    },
  ),
);
