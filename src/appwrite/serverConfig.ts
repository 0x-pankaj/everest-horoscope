//appwrite/serverConfig
import conf from "@/conf/conf";
import { Account, Client, Databases, Users } from "node-appwrite";

const client = new Client();

client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId).setKey(conf.appwriteApiKey)

export const account =  new Account(client)
export const users = new Users(client)
export const database = new Databases(client)
