// // src/hooks/useRoleAccess.ts
// import { roleHierarchy } from '@/lib/rollAccess';
// import { useAuthStore, UserRole } from '@/store/Auth';

// export const useRoleAccess = () => {
//   const roles = useAuthStore((state) => state.roles);

//   const hasAccess = (requiredRole: UserRole): boolean => {
//     if (!roles.length) return false;
//     const userRole = roles[0] as UserRole;
//     return roleHierarchy[requiredRole]?.includes(userRole) || false;
//   };

//   return {
//     isAdmin: () => hasAccess('admin'),
//     isAstrologer: () => hasAccess('astrologer'),
//     isTranslator: () => hasAccess('translator'),
//     hasAccess
//   };
// };
//

// src/hooks/useRoleAccess.ts
import { roleHierarchy } from "@/lib/rollAccess";
import { useAuthStore, UserRole } from "@/store/Auth";

export const useRoleAccess = () => {
  const roles = useAuthStore((state) => state.roles);

  const hasRole = (role: UserRole): boolean => {
    if (!roles.length) return false;
    return roles.includes(role);
  };

  const hasAccess = (requiredRole: UserRole): boolean => {
    if (!roles.length) return false;

    // Check if user has any role that has access to the required role
    return roles.some((userRole) =>
      roleHierarchy[userRole as UserRole]?.includes(requiredRole),
    );
  };

  return {
    // Direct role checks
    isAdmin: () => hasRole("admin"),
    isAstrologer: () => hasRole("astrologer"),
    isTranslator: () => hasRole("translator"),
    isSimpleUser: () => hasRole("simpleuser"),

    // Hierarchical access checks
    hasAccess,

    // Utility to check multiple roles
    hasAnyRole: (checkRoles: UserRole[]) =>
      checkRoles.some((role) => hasRole(role)),
    hasAllRoles: (checkRoles: UserRole[]) =>
      checkRoles.every((role) => hasRole(role)),
  };
};
