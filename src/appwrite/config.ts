
import conf from "@/conf/conf";

import {Client, Account, ID} from "appwrite";

type CreateUserAccount = {
    email: string,
    password: string,
    name: string
}

type LoginUserAccount = {
    email: string,
    password: string
}

export const client = new Client();

client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);

export const account = new Account(client);

export class AppwriteService {
    //create a new record of user inside appwrite
    async createUserAccount({email, password, name}: CreateUserAccount) {
        try {
            const userAccount = await account.create(ID.unique(), email, password, name)
            if(userAccount){
                return this.login({email, password})
            }else{
                return userAccount
            }
        } catch (error: any) {
            throw error;
        }
    }

    //verifySignup
    async verifyUser({email}: any) {
        try {
            await account.createVerification(email)
        } catch (error) {
            throw error
        }
    }

    //login user 
    //route POST /account/sessions/email
    async login({email, password}: LoginUserAccount) {
        try {
            const response =  await account.createEmailPasswordSession(email, password);
            console.log("appwriteservice login response", response);
            return response;
        } catch (error) {
            throw error;
        }
    }

    //password recovery
    async passwordRecovery({email}: {email: string}) {

    }

    //isloggedIn
    async isLoggedIn(): Promise<boolean> {

        try {
            const data = await this.getCurrentUser();
            // if(data) {
            //     return true;
            // }
            return Boolean(data)
        } catch (error) {
            throw error;
        }

        return false;
    }

    //logout
    async logout() {
        try {
            const response =  account.deleteSession("current");
            return response;
        } catch (error) {
            throw error
        }
    }

    //currentUser
    async getCurrentUser() {
        try {
            const response = await account.get();
            return response;
        } catch (error) {
            console.log("getCurrentuser error:: ", error);
        }
        return null;
    }
}

const appwriteService = new AppwriteService();

export default appwriteService;

