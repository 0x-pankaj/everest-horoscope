// src/lib/api/users.ts
import axios from 'axios';
import { User, UserFilters } from '@/types/user';

const API_BASE_URL = '/api/users';
/*
 export const fetchUsers = async (page: number, limit: number, filters: UserFilters) => {
   const response = await axios.get(API_BASE_URL, {
     params: { page, limit, ...filters },
   });
   return response.data;
 };
 */

 export const fetchUserById = async(userId: string) => {
  const response = await axios.get(`${API_BASE_URL}/${userId}`)
  return response.data;
 }

export const fetchUsers = async() => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
}

export const fetchUserByEmail = async (email: string) => {
  const response = await axios.get(`${API_BASE_URL}?email=${email}`);
  return response.data.users[0];
};

export const createUser = async (userData: Partial<User>) => {
  const response = await axios.post(API_BASE_URL, userData);
  return response.data;
};

export const updateUserEmail = async (userId: string, email: string) => {
  const response = await axios.patch(`${API_BASE_URL}/${userId}`, { email });
  return response.data;
};

export const updateUserName = async (userId: string, name: string) => {
  console.log("updatedName: ", name);
  const response = await axios.patch(`${API_BASE_URL}/${userId}`, { name });
  return response.data;
};

export const updateUserPhone = async (userId: string, phone: string) => {
  const response = await axios.patch(`${API_BASE_URL}/${userId}`, { phone });
  return response.data;
};

export const updateUserPassword = async (userId: string, password: string) => {
  const response = await axios.patch(`${API_BASE_URL}/${userId}/password`, { password });
  return response.data;
};

export const updateUserLabels = async (userId: string, labels: string[]) => {
  const response = await axios.patch(`${API_BASE_URL}/${userId}`, { labels });
  return response.data;
};

export const updateUserStatus = async (userId: string, status: boolean) => {
  const response = await axios.patch(`${API_BASE_URL}/${userId}`, { status });
  return response.data;
};

export const updateUserEmailVerification = async (userId: string, emailVerification: boolean) => {
  const response = await axios.patch(`${API_BASE_URL}/${userId}`, { emailVerification });
  return response.data;
};

export const updateUserPhoneVerification = async (userId: string, phoneVerification: boolean) => {
  const response = await axios.patch(`${API_BASE_URL}/${userId}`, { phoneVerification });
  return response.data;
};

export const deleteUser = async (userId: string) => {
  await axios.delete(`${API_BASE_URL}/${userId}`);
};

export const getUserPrefs = async (userId: string) => {
  const response = await axios.get(`${API_BASE_URL}/${userId}/prefs`);
  return response.data;
};

export const updateUserPrefs = async (userId: string, prefs: Record<string, any>) => {
    const response = await axios.patch(`${API_BASE_URL}/${userId}/prefs`, { prefs });
    return response.data;
  };
  
  export const listUserSessions = async (userId: string) => {
    const response = await axios.get(`${API_BASE_URL}/${userId}/sessions`);
    return response.data;
  };
  
  export const deleteUserSessions = async (userId: string) => {
    await axios.delete(`${API_BASE_URL}/${userId}/sessions`);
  };
  
  export const deleteUserSession = async (userId: string, sessionId: string) => {
    await axios.delete(`${API_BASE_URL}/${userId}/sessions/${sessionId}`);
  };
  
  export const listUserLogs = async (userId: string) => {
    const response = await axios.get(`${API_BASE_URL}/${userId}/logs`);
    return response.data;
  };