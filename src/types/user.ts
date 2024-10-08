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
    }
  }

  export interface UserFilters {
    user: User;
    labels?: string[];
  }