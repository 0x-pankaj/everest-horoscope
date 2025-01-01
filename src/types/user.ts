// src/types/user.ts
export interface User {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  email: string;
  password: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  status: boolean;
  passwordUpdate: string;
  registration: string;
  labels: string[];
  accessedAt: string;
  phone: string;
  // prefs: Record<string, any>;
  prefs: {
    dob?: string;
    balance?: number;
    birthCity?: string;
    birthCountry?: string;
    birthDistrict?: string;
    birthState?: string;
    [key: string]: any;
  };
}

export interface UserFilters {
  user: User;
  labels?: string[];
}

export interface Astrologer {
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
  totalConsultations?: number;
  satisfactionRate?: number;
}
