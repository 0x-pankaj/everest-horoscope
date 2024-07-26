

import conf from "@/conf/conf";
import {Client, Users} from "node-appwrite";

let client = new Client();

client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId).setKey(conf.appwriteApiKey);

export const users = new Users(client)
