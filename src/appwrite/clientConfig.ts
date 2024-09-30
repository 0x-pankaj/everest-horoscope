
import conf from "@/conf/conf";
import { Account, Client, Databases, Teams, Storage } from "appwrite";

export const client = new Client();

client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);

export const account = new Account(client);
export const database = new Databases(client);
export const teams = new Teams(client);
export const storage = new Storage(client)