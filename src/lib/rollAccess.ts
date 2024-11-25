import { UserRole } from "@/store/Auth";

// src/lib/roleAccess.ts
export const ROLES = {
    ADMIN: 'admin',
    ASTROLOGER: 'astrologer',
    TRANSLATOR: 'translator',
    SIMPLE_USER: 'simpleuser'
  } as const;
  
  export const roleHierarchy: Record<UserRole, UserRole[]> = {
    admin: ['admin', 'astrologer', 'translator', 'simpleuser'],
    astrologer: ['astrologer', 'simpleuser'],
    translator: ['translator', 'simpleuser'],
    simpleuser: ['simpleuser']
  };