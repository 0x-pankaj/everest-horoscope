// src/hooks/useRoleAccess.ts
import { roleHierarchy } from '@/lib/rollAccess';
import { useAuthStore, UserRole } from '@/store/Auth';

export const useRoleAccess = () => {
  const roles = useAuthStore((state) => state.roles);

  const hasAccess = (requiredRole: UserRole): boolean => {
    if (!roles.length) return false;
    const userRole = roles[0] as UserRole;
    return roleHierarchy[requiredRole]?.includes(userRole) || false;
  };

  return {
    isAdmin: () => hasAccess('admin'),
    isAstrologer: () => hasAccess('astrologer'),
    isTranslator: () => hasAccess('translator'),
    hasAccess
  };
};